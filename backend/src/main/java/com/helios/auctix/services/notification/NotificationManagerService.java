package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Log
@Service
public class NotificationManagerService {

    private final Map<NotificationType, NotificationSender> senderMap;
    private final NotificationSettingsService notificationSettingsService;

    public NotificationManagerService(List<NotificationSender> senders, NotificationSettingsService notificationSettingsService) {
        this.notificationSettingsService = notificationSettingsService;
        this.senderMap = new HashMap<>();
        for (NotificationSender sender : senders) {
            senderMap.put(sender.getNotificationType(), sender);
        }

    }

    public void handleNotification(Notification notification) {
        NotificationCategory category = notification.getNotificationCategory();

        log.info( "Resolving notification type for category: " + category.name() );
        Set<NotificationType> typesToSend = notificationSettingsService.resolveNotificationPreference(category, notification.getUser());
        log.info( "Resolved types for category: " + category.name() + " are " + typesToSend.toString() );
        for (NotificationType type : typesToSend) {
            NotificationSender sender = senderMap.get(type);
            if (sender != null) {
                sender.sendNotification(notification);
            }
        }
    }


}
