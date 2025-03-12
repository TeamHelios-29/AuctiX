package com.helios.auctix.repositories;

import com.helios.auctix.domain.bid.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAmountGreaterThan(Double amount);
    List<Bid> findByBidTimeBetween(LocalDateTime start, LocalDateTime end);
}