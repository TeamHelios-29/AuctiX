package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;

    @Autowired
    public BidService(BidRepository bidRepository, AuctionRepository auctionRepository) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
    }

    // Get bid history for an auction
    public List<Bid> getBidHistoryForAuction(UUID auctionId) {
        return bidRepository.findByAuctionIdOrderByBidTimeDesc(auctionId);
    }

    // Get highest bid for an auction
    public Optional<Bid> getHighestBidForAuction(UUID auctionId) {
        return bidRepository.findTopByAuctionIdOrderByAmountDesc(auctionId);
    }


    // Place a new bid
    @Transactional
    public Bid placeBid(UUID auctionId, UUID bidderId, String bidderName, String bidderAvatar, Double amount) {
        // Find the auction
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        // Check if auction is active
        Instant now = Instant.now();
        if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime())) {
            throw new IllegalStateException("Auction is not active");
        }

        // Check if bid amount is valid
        Optional<Bid> highestBid = getHighestBidForAuction(auctionId);
        if (highestBid.isPresent()) {
            if (amount <= highestBid.get().getAmount()) {
                throw new IllegalArgumentException("Bid amount must be higher than current highest bid");
            }
        } else {
            // No bids yet, check against starting price
            if (amount < auction.getStartingPrice()) {
                throw new IllegalArgumentException("Bid amount must be at least the starting price");
            }
        }



        // Create and save the bid
        Bid bid = Bid.builder()
                .auction(auction)
                .bidderId(bidderId)
                .bidderName(bidderName)
                .bidderAvatar(bidderAvatar)
                .amount(amount)
                .bidTime(now)
                .build();

        return bidRepository.save(bid);
    }
}
