package com.helios.auctix.repositories;

import com.helios.auctix.domain.delivery.Delivery;
import com.helios.auctix.domain.delivery.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {

    List<Delivery> findBySellerId(UUID sellerId);

    List<Delivery> findByBuyerId(UUID buyerId);

    List<Delivery> findBySellerIdAndStatus(UUID sellerId, DeliveryStatus status);

    List<Delivery> findByBuyerIdAndStatus(UUID buyerId, DeliveryStatus status);

    List<Delivery> findByAuctionId(UUID auctionId);

    @Query("SELECT d FROM Delivery d WHERE d.seller.id = :userId OR d.buyer.id = :userId")
    List<Delivery> findAllByUser(UUID userId);
}