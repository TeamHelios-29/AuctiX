package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationType;

public interface NotificationSender {
    NotificationType getNotificationType();
    void sendNotification(Notification notification);
}
