package com.helios.auctix.services.notification.senders;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.services.notification.NotificationSender;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationSender implements NotificationSender {
    @Override
    public void sendNotification(Notification notification) {
        System.out.println("Got the notification to send to email" + notification.toString());
    }
}
