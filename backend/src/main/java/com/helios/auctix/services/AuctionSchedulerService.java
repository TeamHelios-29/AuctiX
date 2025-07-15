package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.events.notification.NotificationEventPublisher;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.BidRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.repositories.WalletRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
@Slf4j
public class AuctionSchedulerService {

    private static final Logger logger = Logger.getLogger(AuctionSchedulerService.class.getName());

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final BidService bidService;
    private final CoinTransactionService transactionService;
    private final NotificationEventPublisher notificationEventPublisher;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public AuctionSchedulerService(
            AuctionRepository auctionRepository,
            BidRepository bidRepository,
            BidService bidService,
            CoinTransactionService transactionService,
            NotificationEventPublisher notificationEventPublisher,
            UserRepository userRepository,
            WalletRepository walletRepository) {
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.bidService = bidService;
        this.transactionService = transactionService;
        this.notificationEventPublisher = notificationEventPublisher;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    /**
     * Scheduled job to check for completed auctions every minute
     */
    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void processCompletedAuctions() {
        try {
            Instant now = Instant.now();
            logger.info("Running scheduled job to process completed auctions at " + now);

            // Find auctions that have ended but haven't been processed yet
            List<Auction> completedAuctions = auctionRepository.findByEndTimeBeforeAndCompletedFalse(now);

            logger.info("Found " + completedAuctions.size() + " completed auctions to process");

            for (Auction auction : completedAuctions) {
                try {
                    processAuctionCompletion(auction);
                } catch (Exception e) {
                    logger.severe("Error processing auction completion for auction ID " + auction.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            logger.severe("Error in scheduled auction processing: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public void processAuctionCompletion(Auction auction) {
        UUID auctionId = auction.getId();
        logger.info("Processing completion for auction: " + auctionId);

        try {
            // Find the highest bid
            Optional<Bid> highestBid = bidRepository.findTopByAuctionIdOrderByAmountDesc(auctionId);

            if (highestBid.isPresent()) {
                Bid winningBid = highestBid.get();
                User bidder = userRepository.findById(winningBid.getBidderId()).orElse(null);
                User seller = auction.getSeller().getUser();

                logger.info("Winning bid found: " + winningBid.getId() + " by bidder " + winningBid.getBidderId() +
                        " with amount " + winningBid.getAmount());

                // Complete the transaction - transfer from frozen funds to seller
                try {
                    // 1. Complete the bidder's transaction (unfreeze and deduct funds)
                    transactionService.completeBidTransaction(
                            winningBid.getBidderId(),
                            auctionId,
                            winningBid.getAmount()
                    );

                    // 2. Credit the seller's wallet
                    transactionService.creditSellerForAuction(
                            seller.getId(),
                            auctionId,
                            winningBid.getAmount()
                    );

                    // 3. Send notifications
                    if (bidder != null) {
                        try {
                            notificationEventPublisher.publishNotificationEvent(
                                    "Auction Won!",
                                    "Congratulations! You won the auction for " + auction.getTitle() + " with a bid of " + winningBid.getAmount(),
                                    NotificationCategory.AUCTION_WON,
                                    bidder,
                                    "/auction-details/" + auction.getId()
                            );
                        } catch (Exception e) {
                            logger.warning("Failed to send buyer notification, but continuing: " + e.getMessage());
                        }
                    }

                    try {
                        notificationEventPublisher.publishNotificationEvent(
                                "Auction Completed",
                                "Your auction " + auction.getTitle() + " has completed successfully with a winning bid of " + winningBid.getAmount(),
                                NotificationCategory.AUCTION_COMPLETED,
                                seller,
                                "/auction-details/" + auction.getId()
                        );
                    } catch (Exception e) {
                        logger.warning("Failed to send seller notification, but continuing: " + e.getMessage());
                    }

                    // 4. Mark the auction as completed
                    auction.setCompleted(true);
                    auction.setWinningBidId(winningBid.getId());
                    auctionRepository.save(auction);

                    logger.info("Successfully completed auction: " + auctionId);

                } catch (Exception e) {
                    logger.severe("Error processing transaction for auction " + auctionId + ": " + e.getMessage());
                    throw e; // Re-throw to trigger transaction rollback
                }
            } else {
                // No bids were placed
                logger.info("No bids found for auction: " + auctionId + ". Marking as completed without a winner.");

                // Notify the seller that auction ended without bids
                try {
                    notificationEventPublisher.publishNotificationEvent(
                            "Auction Ended Without Bids",
                            "Your auction " + auction.getTitle() + " has ended without any bids.",
                            NotificationCategory.AUCTION_COMPLETED,
                            auction.getSeller().getUser(),
                            "/auction-details/" + auction.getId()

                    );
                } catch (Exception e) {
                    logger.warning("Failed to send notification, but continuing: " + e.getMessage());
                }

                // Mark auction as completed
                auction.setCompleted(true);
                auctionRepository.save(auction);
            }
        } catch (Exception e) {
            logger.severe("Error completing auction " + auctionId + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Manual trigger to process a specific auction completion (can be used for testing or admin functions)
     */
    @Transactional
    public void manuallyCompleteAuction(UUID auctionId) {
        try {
            Auction auction = auctionRepository.findById(auctionId)
                    .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + auctionId));

            processAuctionCompletion(auction);
        } catch (Exception e) {
            logger.severe("Error manually completing auction: " + e.getMessage());
            throw e;
        }
    }
}