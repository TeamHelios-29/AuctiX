package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, UUID> {

    // OPTION 1: Active auctions = Currently running (started and not ended)
    @Query("SELECT a FROM Auction a WHERE a.startTime <= :now AND a.endTime > :now AND a.isPublic = true ORDER BY a.startTime DESC")
    List<Auction> findActiveAuctions(@Param("now") Instant now);

    // OPTION 2: Available auctions = Not yet ended (includes future auctions)
    @Query("SELECT a FROM Auction a WHERE a.endTime > :now AND a.isPublic = true ORDER BY a.startTime DESC")
    List<Auction> findAvailableAuctions(@Param("now") Instant now);

    // OPTION 3: Upcoming auctions = Future auctions that haven't started
    @Query("SELECT a FROM Auction a WHERE a.startTime > :now AND a.endTime > :now AND a.isPublic = true ORDER BY a.startTime ASC")
    List<Auction> findUpcomingAuctions(@Param("now") Instant now);

    // Find expired auctions within the last 3 days
    @Query("SELECT a FROM Auction a WHERE a.endTime < :now AND a.endTime >= :threeDaysAgo AND a.isPublic = true ORDER BY a.endTime DESC")
    List<Auction> findExpiredAuctions(@Param("now") Instant now, @Param("threeDaysAgo") Instant threeDaysAgo);

    // Find all public auctions (useful for "All Auctions" filter)
    @Query("SELECT a FROM Auction a WHERE a.isPublic = true ORDER BY a.createdAt DESC")
    List<Auction> findAllPublicAuctions();

    // Find auctions by seller
    @Query("SELECT a FROM Auction a WHERE a.seller.id = :sellerId ORDER BY a.createdAt DESC")
    List<Auction> findBySellerId(@Param("sellerId") UUID sellerId);
}