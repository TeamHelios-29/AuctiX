package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.Bidder;
import com.helios.auctix.domain.user.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidderRepository extends JpaRepository<Bidder, Long> {
}
