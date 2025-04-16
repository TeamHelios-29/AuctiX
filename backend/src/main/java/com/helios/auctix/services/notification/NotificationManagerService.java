package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class NotificationManagerService {

    private final Map<NotificationType, NotificationSender> senderMap;
    private final Map<NotificationCategory, Set<NotificationType>> defaultPreferences;

    public NotificationManagerService(List<NotificationSender> senders) {
        this.senderMap = new HashMap<>();
        for (NotificationSender sender : senders) {
            senderMap.put(sender.getNotificationType(), sender);
        }

        this.defaultPreferences = setDefaultPreferences();
    }

    public void handleNotification(Notification notification) {
        NotificationCategory category = notification.getNotificationCategory();
        Set<NotificationType> typesToSend = defaultPreferences.getOrDefault(category, Set.of(NotificationType.EMAIL));

        for (NotificationType type : typesToSend) {
            NotificationSender sender = senderMap.get(type);
            if (sender != null) {
                sender.sendNotification(notification);
            }
        }
    }


    private  Map<NotificationCategory, Set<NotificationType>> setDefaultPreferences() {
        Map<NotificationCategory, Set<NotificationType>> defaultPreferences = new HashMap<>();

        // Set default preferences like this for now
        defaultPreferences.put(NotificationCategory.DEFAULT, Set.of(
                NotificationType.EMAIL,
//                NotificationType.WEBSOCKET,
                NotificationType.PUSH
        ));

        defaultPreferences.put(NotificationCategory.PROMO, Set.of(
                NotificationType.EMAIL,
                NotificationType.PUSH
        ));

        return defaultPreferences;
    }

}
