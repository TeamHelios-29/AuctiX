package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    // Find active auctions (started but not ended) that are public
    List<Auction> findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(Instant now, Instant now2);

    // Find auctions by category
    List<Auction> findByCategory(String category);
}