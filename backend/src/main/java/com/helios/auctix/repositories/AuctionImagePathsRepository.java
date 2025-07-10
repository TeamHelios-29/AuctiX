package com.helios.auctix.repositories;

import com.helios.auctix.domain.auction.AuctionImagePath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuctionImagePathsRepository extends JpaRepository<AuctionImagePath, Long> {
    List<AuctionImagePath> findById_AuctionId(UUID auctionId);

}
