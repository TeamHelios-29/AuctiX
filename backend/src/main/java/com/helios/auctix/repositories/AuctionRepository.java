package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.Auction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
//    @Query("SELECT a FROM Auction a WHERE a.startTime <= :now AND a.endTime > :now AND a.isPublic = true ORDER BY a.startTime DESC")
//    List<Auction> findActiveAuctions(@Param("now") Instant now);
//
//    // OPTION 2: Available auctions = Not yet ended (includes future auctions)
//    @Query("SELECT a FROM Auction a WHERE a.endTime > :now AND a.isPublic = true ORDER BY a.startTime DESC")
//    List<Auction> findAvailableAuctions(@Param("now") Instant now);
//
//    // OPTION 3: Upcoming auctions = Future auctions that haven't started
//    @Query("SELECT a FROM Auction a WHERE a.startTime > :now AND a.endTime > :now AND a.isPublic = true ORDER BY a.startTime ASC")
//    List<Auction> findUpcomingAuctions(@Param("now") Instant now);
//
//    // Find expired auctions within the last 3 days
//    @Query("SELECT a FROM Auction a WHERE a.endTime < :now AND a.endTime >= :threeDaysAgo AND a.isPublic = true ORDER BY a.endTime DESC")
//    List<Auction> findExpiredAuctions(@Param("now") Instant now, @Param("threeDaysAgo") Instant threeDaysAgo);

    // Find all public auctions (useful for "All Auctions" filter)
    @Query("SELECT a FROM Auction a WHERE a.isPublic = true ORDER BY a.createdAt DESC")
    List<Auction> findAllPublicAuctions();

    // Find auctions by seller
    @Query("SELECT a FROM Auction a WHERE a.seller.id = :sellerId ORDER BY a.createdAt DESC")
    List<Auction> findBySellerId(@Param("sellerId") UUID sellerId);

    @Query(value = """
  SELECT * FROM auctions
  WHERE start_time <= :now
    AND end_time > :now
    AND is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  ORDER BY 
    CASE WHEN :tsQuery IS NULL THEN start_time END DESC,
    CASE WHEN :tsQuery IS NOT NULL THEN ts_rank(search_vector, to_tsquery('english', :tsQuery)) END DESC
  """,
            countQuery = """
  SELECT count(*) FROM auctions
  WHERE start_time <= :now
    AND end_time > :now
    AND is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  """,
            nativeQuery = true)
    Page<Auction> findActiveAuctionsPaged(
            @Param("now") Instant now,
            @Param("category") String category,
            @Param("tsQuery") String tsQuery,
            Pageable pageable
    );


    @Query(value = """
  SELECT * FROM auctions
  WHERE start_time > :now
    AND end_time > :now
    AND is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  ORDER BY 
    CASE WHEN :tsQuery IS NULL THEN start_time END ASC,
    CASE WHEN :tsQuery IS NOT NULL THEN ts_rank(search_vector, to_tsquery('english', :tsQuery)) END DESC
  """,
            countQuery = """
  SELECT count(*) FROM auctions
  WHERE start_time > :now
    AND end_time > :now
    AND is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  """,
            nativeQuery = true)
    Page<Auction> findUpcomingAuctionsPaged(
            @Param("now") Instant now,
            @Param("category") String category,
            @Param("tsQuery") String tsQuery,
            Pageable pageable
    );


    @Query(value = """
  SELECT * FROM auctions
  WHERE end_time < :now
    AND end_time >= :threeDaysAgo
    AND is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  ORDER BY 
    CASE WHEN :tsQuery IS NULL THEN end_time END DESC,
    CASE WHEN :tsQuery IS NOT NULL THEN ts_rank(search_vector, to_tsquery('english', :tsQuery)) END DESC
  """,
            countQuery = """
  SELECT count(*) FROM auctions
  WHERE end_time < :now
    AND end_time >= :threeDaysAgo
    AND is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  """,
            nativeQuery = true)
    Page<Auction> findExpiredAuctionsPaged(
            @Param("now") Instant now,
            @Param("threeDaysAgo") Instant threeDaysAgo,
            @Param("category") String category,
            @Param("tsQuery") String tsQuery,
            Pageable pageable
    );


    @Query(value = """
  SELECT * FROM auctions
  WHERE is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  ORDER BY 
    CASE WHEN :tsQuery IS NULL THEN start_time END DESC,
    CASE WHEN :tsQuery IS NOT NULL THEN ts_rank(search_vector, to_tsquery('english', :tsQuery)) END DESC
  """,
            countQuery = """
  SELECT count(*) FROM auctions
  WHERE is_public = true
    AND is_deleted = false
    AND (:category IS NULL OR LOWER(category) = LOWER(:category))
    AND (:tsQuery IS NULL OR search_vector @@ to_tsquery('english', :tsQuery))
  """,
            nativeQuery = true)
    Page<Auction> findAllPaged(
            @Param("category") String category,
            @Param("tsQuery") String tsQuery,
            Pageable pageable
    );


}