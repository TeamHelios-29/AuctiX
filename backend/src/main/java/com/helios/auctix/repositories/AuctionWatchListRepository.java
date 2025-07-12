package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.watchlist.AuctionWatchList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuctionWatchListRepository extends JpaRepository<AuctionWatchList, UUID> {
    boolean existsByUserAndAuction(User user, Auction auction);

    Optional<AuctionWatchList> findByUserAndAuction(User user, Auction auction);

    Page<AuctionWatchList> findAllByUser_Id(UUID userId, Pageable pageable);

    List<User> findUsersByAuction_Id(UUID auctionId);
}
