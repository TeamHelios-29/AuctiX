package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.BidUpdateMessageDTO;
import com.helios.auctix.events.notification.NotificationEventPublisher;
import com.helios.auctix.services.user.UserDetailsService;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.dtos.PlaceBidRequest;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.mappers.impl.UserMapperImpl;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.BidRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;


@AllArgsConstructor
@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final CoinTransactionService transactionService;
    private final UserDetailsService userDetailsService;
    private static final Logger log = Logger.getLogger(BidService.class.getName());
    private final UserMapperImpl userMapperImpl;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationEventPublisher notificationEventPublisher;
    private final WatchListNotifyService watchListNotifyService;

    // Get bid history for an auction
    public List<Bid> getBidHistoryForAuction(UUID auctionId) {
        return bidRepository.findByAuctionIdOrderByBidTimeDesc(auctionId)
                .stream()
                .limit(10)
                .toList();
    }

    // Get the highest bid for an auction
    public Optional<Bid> getHighestBidForAuction(UUID auctionId) {
        return bidRepository.findTopByAuctionIdOrderByAmountDesc(auctionId);
    }

    // Add this method to get bidder details
    public BidDTO convertToDTO(Bid bid) {

        User bidder = userRepository.findById(bid.getBidderId()).orElse(null);

        UserDTO bidderDto = userMapperImpl.mapTo(bidder);


        return BidDTO.builder()
                .id(bid.getId())
                .auctionId(bid.getAuction().getId())
                .auctionTitle(bid.getAuction().getTitle())
                .bidderId(bid.getBidderId())
                .bidderName(bid.getBidderName())
                .bidderAvatar(bid.getBidderAvatar())
                .amount(bid.getAmount())
                .bidTime(bid.getBidTime())
                .createdAt(bid.getCreatedAt())
                .bidder(bidderDto) // ✅ include full bidder
                .build();
    }

    // Method for placing a new bid
    @Transactional
    public BidDTO placeBid(PlaceBidRequest request, User bidder) {

        UUID auctionId = request.getAuctionId();
        Double amount = request.getAmount();
        List<User> excludedFromWatchlistNotify = new ArrayList<>();

        UUID bidderId = bidder.getId();
        String bidderName = bidder.getFirstName() + " " + bidder.getLastName();
        UUID bidderAvatar = null;
        if(bidder.getUpload()!=null){
            bidderAvatar = bidder.getUpload().getId();
        }


        // Find the auction given through request
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        // Check if auction is active
        Instant now = Instant.now();
        if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime())) {
            throw new IllegalStateException("Auction is not active");
        }

        // Set bidTime server-side
        Instant bidTime = Instant.now(); // 🚀 Always use server time

        // Check if bid amount is valid
        Optional<Bid> highestBid = getHighestBidForAuction(auctionId);
        log.info("Highest bid: " + (highestBid.isPresent() ? highestBid.get().getAmount() : "none"));

        // If there's a previous highest bid by this user, unfreeze it first
        highestBid.ifPresent(bid -> {
            if (bid.getBidderId().equals(bidderId)) {
                log.info("User is outbidding themselves. Unfreezing previous bid of " + bid.getAmount());
                try {
                    transactionService.unfreezeAmount(
                            bidderId,
                            bid.getAmount(),
                            "Outbidding own bid on auction " + auctionId
                    );
                } catch (Exception e) {
                    log.severe("Failed to unfreeze previous bid: " + e.getMessage());
                    throw new IllegalStateException("Failed to unfreeze previous bid: " + e.getMessage());
                }
            }
        });

        if (highestBid.isPresent()) {
            if (amount <= highestBid.get().getAmount()) {
                log.warning("Bid too low: " + amount + " <= " + highestBid.get().getAmount());
                throw new IllegalArgumentException("Bid amount must be higher than current highest bid");
            }

            // If a different user previously had the highest bid, unfreeze their amount
            if (!highestBid.get().getBidderId().equals(bidderId)) {
                log.info("Outbidding user " + highestBid.get().getBidderId() + ". Unfreezing their bid of " + highestBid.get().getAmount());
                try {
                    transactionService.unfreezeAmount(
                            highestBid.get().getBidderId(),
                            highestBid.get().getAmount(),
                            "Outbid on auction " + auctionId
                    );


                    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            String title = "You've been outbid";
                            String message = "Your bid of LKR " +
                                    highestBid.get().getAmount()  + " on auction " +
                                    auction.getTitle() + " was outbid by a user placing a bid of LKR" + amount + " ! " +
                                    "Reclaim the highest bid to secure the win!" ;
                            User userToNotify = userDetailsService.getUserById(highestBid.get().getBidderId());
                            excludedFromWatchlistNotify.add(userToNotify);
                            notificationEventPublisher.publishNotificationEvent(
                                    title,
                                    message,
                                    NotificationCategory.OUTBID,
                                    userToNotify,
                                    "/auctions/" + auction.getId()
                            );
                        }
                    });

                } catch (Exception e) {
                    log.severe("Failed to unfreeze previous bidder's funds: " + e.getMessage());
                    throw new IllegalStateException("Failed to unfreeze previous bidder's funds: " + e.getMessage());
                }
            }
        } else {
            // No bids yet, check against starting price
            if (amount < auction.getStartingPrice()) {
                log.warning("Bid below starting price: " + amount + " < " + auction.getStartingPrice());
                throw new IllegalArgumentException("Bid amount must be at least the starting price");
            }
        }

        // Freeze the bid amount in the user's wallet
        try {
            log.info("Freezing " + amount + " for bid");
            transactionService.freezeAmount(amount, auctionId);
        } catch (Exception e) {
            log.severe("Failed to freeze funds: " + e.getMessage());
            throw new IllegalStateException("Failed to freeze funds: " + e.getMessage());
        }

        // Create and save the bid
        Bid bid = Bid.builder()
                .auction(auction)
                .bidderId(bidderId)
                .bidderName(bidderName)
                .bidderAvatar(String.valueOf(bidderAvatar))
                .amount(amount)
                .bidTime(now)
                .build();

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                String title = "New bid placed on auction " + auction.getTitle() ;
                String message = "A bidder has placed a bid of " + bid.getAmount() + " on the auction " + auction.getTitle()  + "check it out on AuctiX" ;

                // notify seller
                notificationEventPublisher.publishNotificationEvent(
                        title,
                        message,
                        NotificationCategory.NEW_BID_RECEIVED_SELLER,
                        auction.getSeller().getUser(),
                        "/auctions/" + auction.getId()
                );

                // notify watchlist users
                excludedFromWatchlistNotify.add(bidder);

                
                watchListNotifyService.notifySubscribers(
                        auction,
                        excludedFromWatchlistNotify,
                        title,
                        message,
                        NotificationCategory.NEW_BID_RECEIVED_WATCHER,
                        "/auctions/" + auction.getId()
                );

            }
        });

        Bid savedBid = bidRepository.save(bid);

        BidDTO bidDTO = convertToDTO(savedBid);
        List<BidDTO> history = getBidHistoryForAuction(auctionId).stream()
                .map(this::convertToDTO)
                .toList();

        BidUpdateMessageDTO message = BidUpdateMessageDTO.builder()
                .auctionId(auctionId)
                .newBid(bidDTO)
                .bidHistory(history)
                .build();

        // Send to WebSocket topic
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId, message);


        return bidDTO;

    }


    @Transactional
    public void finalizeAuction(UUID auctionId) {
        Optional<Bid> winningBid = getHighestBidForAuction(auctionId);

        if (winningBid.isPresent()) {
            Bid bid = winningBid.get();

            // Complete the transaction for the winning bidder
            try {
                transactionService.completeBidTransaction(
                        bid.getBidderId(),
                        auctionId,
                        bid.getAmount()
                );
            } catch (Exception e) {
                throw new IllegalStateException("Failed to complete transaction: " + e.getMessage());
            }

            // Logic to transfer funds to seller would go here in a production app
        }
    }
}