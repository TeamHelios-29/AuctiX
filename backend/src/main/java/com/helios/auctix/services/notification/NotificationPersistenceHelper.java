package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.repositories.NotificationRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationPersistenceHelper {

    private final NotificationRepository notificationRepository;

    public NotificationPersistenceHelper(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void finalizeAndSave(Notification notification, NotificationType type) {
        notification.setNotificationType(type);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}
