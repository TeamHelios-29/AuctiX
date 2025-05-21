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
    List<Auction> findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(Instant now, Instant now1);

    // Shortened version with better method name
    default List<Auction> findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(Instant now) {
        return findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(now, now);
    }

    // Find auctions that have ended and not been marked as completed yet
    List<Auction> findByEndTimeBeforeAndCompletedFalse(Instant now);

    // Method used in service to get active auctions
    default List<Auction> findActiveAuctions() {
        Instant now = Instant.now();
        return findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(now, now);
    }
}