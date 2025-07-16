package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.watchlist.AuctionWatchList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuctionWatchListRepository extends JpaRepository<AuctionWatchList, UUID> {
    boolean existsByUserAndAuction(User user, Auction auction);

    Optional<AuctionWatchList> findByUserAndAuction(User user, Auction auction);

    List<User> findUsersByAuction_Id(UUID auctionId);

    @Query("""
        SELECT wl FROM AuctionWatchList wl
        JOIN wl.auction a
        WHERE wl.user.id = :userId
          AND (
            :search IS NULL OR :search = ''
            OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))
          )
    """)
    Page<AuctionWatchList> findWatchedAuctionsWithSearch(
            @Param("userId") UUID userId,
            @Param("search") String search,
            Pageable pageable
    );

    Page<AuctionWatchList> findByUserId(UUID userId, Pageable pageable);

}
