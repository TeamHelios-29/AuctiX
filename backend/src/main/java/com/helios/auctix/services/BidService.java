package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.BidRepository;
import com.helios.auctix.services.user.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final CoinTransactionService transactionService;
    private final UserDetailsService userDetailsService;
    private static final Logger log = Logger.getLogger(BidService.class.getName());

    @Autowired
    public BidService(
            BidRepository bidRepository,
            AuctionRepository auctionRepository,
            CoinTransactionService transactionService,
            UserDetailsService userDetailsService) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.transactionService = transactionService;
        this.userDetailsService = userDetailsService;
    }

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

    // Place a new bid
    @Transactional
    public Bid placeBid(UUID auctionId, String bidderName, String bidderAvatar, Double amount) {
        try {
            log.info("Placing bid of " + amount + " on auction " + auctionId);

            // Get the current authenticated user
            User currentUser = getCurrentUser();
            UUID bidderId = currentUser.getId();

            log.info("Current user: " + currentUser.getUsername() + " (ID: " + bidderId + ")");

            // Find the auction
            Auction auction = auctionRepository.findById(auctionId)
                    .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

            log.info("Found auction: " + auction.getTitle());

            // Check if auction is active
            Instant now = Instant.now();
            if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime())) {
                log.warning("Auction is not active. Current time: " + now + ", Start: " + auction.getStartTime() + ", End: " + auction.getEndTime());
                throw new IllegalStateException("Auction is not active");
            }

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
                    .id(UUID.randomUUID()) // Explicitly set the UUID
                    .auction(auction)
                    .bidderId(bidderId)
                    .bidderName(bidderName != null ? bidderName : currentUser.getUsername())
                    .bidderAvatar(bidderAvatar)
                    .amount(amount)
                    .bidTime(now)
                    .build();

            Bid savedBid = bidRepository.save(bid);
            log.info("Bid placed successfully: " + savedBid.getId());

            return savedBid;
        } catch (Exception e) {
            log.severe("Error placing bid: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to propagate to controller
        }
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

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        try {
            return userDetailsService.getAuthenticatedUser(authentication);
        } catch (Exception e) {
            throw new RuntimeException("Authentication error: " + e.getMessage());
        }
    }
}