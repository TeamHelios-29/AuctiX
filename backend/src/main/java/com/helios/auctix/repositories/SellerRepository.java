package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SellerRepository extends CrudRepository<Seller, UUID> {
    Seller getSellerById(UUID id);
}
