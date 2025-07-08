package com.helios.auctix.repositories;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Deprecated
    Page<Notification> findByUserId(UUID userId, Pageable pageable);

    @Query("""
    SELECT n FROM Notification n
    WHERE n.user.id = :userId
      AND (:onlyUnread = false OR n.read = false)
      AND (:category IS NULL OR n.notificationCategory = :category)
    """)
    Page<Notification> findByFilters(
            @Param("userId") UUID userId,
            @Param("onlyUnread") boolean onlyUnread,
            @Param("category") NotificationCategory category,
            Pageable pageable
    );

    @Deprecated
    Page<Notification> findByUserIdAndReadFalse(UUID userId, Pageable pageable);

    Optional<Notification> findByIdAndUserId(UUID notificationId, UUID userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.read = false")
    long countUnreadByUserId(@Param("userId") UUID userId);

    void deleteByIdAndUserId(UUID notificationId, UUID userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user.id = :userId AND n.read = false")
    void markAllAsReadForUser(@Param("userId") UUID userId);

//    Page<Notification> findByUserIdAndNotificationCategory(UUID userId, Pageable pageable, String notificationCategory);
}
