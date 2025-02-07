package com.helios.auctix.services.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.services.notification.senders.EmailNotificationSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener implements ApplicationListener<NotificationEvent> {

    @Autowired
    private EmailNotificationSender emailNotificationSender;

    @Override
    public void onApplicationEvent(NotificationEvent event) {
        System.out.println("Received spring event - " + event.getMessage());

        NotificationCategory notificationCategory = event.getNotificationCategory();

        Notification.NotificationBuilder notificationBuilder =
                Notification
                        .builder()
                        .user(event.getUserToNotify())
                        .notificationCategory(event.getNotificationCategory())
                        .notificationEvent(event.toString()) // TODO decide if we are storing this
                        .content(event.getMessage())
                ;

        switch (notificationCategory) {
            case DEFAULT -> {
                System.out.println(notificationCategory + " category sending to all notification senders");
                notificationBuilder.notificationType(NotificationType.EMAIL);
                emailNotificationSender.sendNotification(notificationBuilder.build());
            }
        }
    }
}