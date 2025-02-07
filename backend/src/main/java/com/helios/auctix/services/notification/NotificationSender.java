package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;

public interface NotificationSender {

    void sendNotification(Notification notification);
}
