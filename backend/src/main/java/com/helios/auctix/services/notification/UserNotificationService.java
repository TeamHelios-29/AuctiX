package com.helios.auctix.services.notification;

import com.google.api.gax.rpc.NotFoundException;
import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.dtos.NotificationResponseDto;
import com.helios.auctix.repositories.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserNotificationService {

    private final NotificationRepository notificationRepository;

    public UserNotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    public Page<NotificationResponseDto> getUserNotifications(UUID userId, boolean onlyUnread, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notificationsPage = onlyUnread
                ? notificationRepository.findByUserIdAndReadFalse(userId, pageable)
                : notificationRepository.findByUserId(userId, pageable);

        return notificationsPage.map(this::toDto);
    }

    public long getUnreadNotificationCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAsUnread(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    @Transactional
    public void deleteNotification(UUID notificationId, UUID userId) {
        notificationRepository.deleteByIdAndUserId(notificationId, userId);
    }

    private NotificationResponseDto toDto(Notification n) {
        return NotificationResponseDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .read(n.isRead())
                .notificationCategory(n.getNotificationCategory().getTitle())
                .notificationCategoryGroup(n.getNotificationCategory().getCategoryGroup().name())
                .createdAt(n.getCreatedAt())
                .build();
    }

//    public long getForCategory(UUID id, NotificationCategory notificationCategory) {
//        Pageable pageable = PageRequest.of(1, 1, Sort.by(Sort.Direction.DESC, "createdAt"));
//        notificationRepository.findByUserIdAndNotificationCategory(notificationCategory)
//    }
}
