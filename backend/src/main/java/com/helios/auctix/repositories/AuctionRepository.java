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

    List<Auction> findByStartTimeBetween(Instant from, Instant to);

    List<Auction> findByEndTimeBetween(Instant from, Instant to);

    @Query(value = """
    SELECT EXISTS (
        SELECT 1 FROM auctions
        WHERE id = CAST(:auctionId AS UUID)
        AND seller_id = CAST(:sellerId AS UUID)
    )
    """, nativeQuery = true)
    boolean isSellerOwnerOfAuction(@Param("auctionId") UUID auctionId, @Param("sellerId") UUID sellerId);

    @Query(value = """
    SELECT * FROM auctions
    WHERE search_vector @@ to_tsquery('english', :tsQuery)
      AND is_deleted = false
    ORDER BY ts_rank(search_vector, to_tsquery('english', :tsQuery)) DESC
    LIMIT 50
    """, nativeQuery = true)
    List<Auction> searchByFullText(@Param("tsQuery") String tsQuery);

}