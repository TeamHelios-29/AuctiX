package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.repositories.NotificationRepository;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Executor;

@Log
@Service
public class NotificationManagerService {

    private final Map<NotificationType, NotificationSender> senderMap;
    private final NotificationSettingsService notificationSettingsService;
    private final NotificationRepository notificationRepository;
    private final Executor notificationExecutor;

    public NotificationManagerService(
            List<NotificationSender> senders,
            NotificationSettingsService notificationSettingsService,
            NotificationRepository notificationRepository,
            Executor notificationExecutor
    ) {
        this.notificationSettingsService = notificationSettingsService;
        this.notificationExecutor = notificationExecutor;
        this.senderMap = new HashMap<>();
        this.notificationRepository = notificationRepository;
        for (NotificationSender sender : senders) {
            senderMap.put(sender.getNotificationType(), sender);
        }
    }

    /**
     * Handles a single notification: saves it and sends via preferred channels.
     *  @param notification Notification to send
     */
    public void handleNotification(Notification notification) {
        notificationRepository.save(notification);
        sendNotification(notification);
    }

    /***
     * Handles a bulk list of notifications: saves in batch, sends them in parallel
     * @param notifications List of notifications to send
     */
    public void handleBulkNotifications(List<Notification> notifications) {
        List<Notification> savedNotifications = saveAllNotifications(notifications);

        for (Notification notification : savedNotifications) {
            notificationExecutor.execute(() -> {
                try {
                    sendNotification(notification);
                } catch (Exception e) {
                    log.warning("Failed to send notification: " + notification.getId() + " " + e.getMessage());
                }
            });
        }
    }

    /**
     *  Resolves the user's preferences for the notification and sends the notification using those channel types
     */
    private void sendNotification(Notification notification) {
        NotificationCategory category = notification.getNotificationCategory();

        log.info("Resolving notification type for category: " + category.name());
        Set<NotificationType> typesToSend = notificationSettingsService.resolveNotificationPreference(category, notification.getUser());
        log.info("Resolved types for category: " + category.name() + " are " + typesToSend);

        for (NotificationType type : typesToSend) {
            NotificationSender sender = senderMap.get(type);
            if (sender != null) {
                sender.sendNotification(notification);
            }
        }
    }

    /**
     * Saves a batch of notifications in one transaction.
     */
    @Transactional
    private List<Notification> saveAllNotifications(List<Notification> notifications) {
        return notificationRepository.saveAll(notifications);
    }


}
