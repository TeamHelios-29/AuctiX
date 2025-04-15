package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository extends JpaRepository<Seller, Long> {
}
