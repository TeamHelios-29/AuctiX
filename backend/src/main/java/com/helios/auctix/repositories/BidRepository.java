package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionIdOrderByAmountDesc(Long auctionId);

    // Find the highest bid for an auction
    Optional<Bid> findTopByAuctionIdOrderByAmountDesc(Long auctionId);

    // Find bid history for an auction, ordered by time (newest first)
    List<Bid> findByAuctionIdOrderByBidTimeDesc(Long auctionId);

    // Count the number of bids for an auction
    Long countByAuctionId(Long auctionId);
}
