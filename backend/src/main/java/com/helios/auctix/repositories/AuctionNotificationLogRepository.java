package com.helios.auctix.repositories;

import com.helios.auctix.domain.notification.AuctionNotificationLog;
import com.helios.auctix.domain.notification.NotificationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuctionNotificationLogRepository extends JpaRepository<AuctionNotificationLog, UUID> {

    Optional<AuctionNotificationLog> findTopByAuctionIdAndCategoryOrderBySentAtDesc(UUID auctionId, NotificationCategory category);
}
