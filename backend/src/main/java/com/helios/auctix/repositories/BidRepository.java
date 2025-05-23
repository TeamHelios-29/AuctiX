package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BidRepository extends JpaRepository<Bid, UUID> {

    List<Bid> findByAuctionIdOrderByAmountDesc(UUID auctionId);

    // Find the highest bid for an auction
    Optional<Bid> findTopByAuctionIdOrderByAmountDesc(UUID auctionId);

    // Find bid history for an auction, ordered by time (newest first)
    List<Bid> findByAuctionIdOrderByBidTimeDesc(UUID auctionId);

    // Count the number of bids for an auction
    Long countByAuctionId(UUID auctionId);
}
