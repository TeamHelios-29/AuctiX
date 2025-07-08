package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, UUID> {
    // Find active auctions
    List<Auction> findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(Instant now, Instant now2);

    // Find auctions by category
    List<Auction> findByCategory(String category);
}