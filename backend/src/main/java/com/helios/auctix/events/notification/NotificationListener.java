package com.helios.auctix.events.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.services.notification.NotificationManagerService;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener implements ApplicationListener<NotificationEvent> {


    private final NotificationManagerService notificationManagerService;

    NotificationListener(NotificationManagerService notificationManagerService) {
        this.notificationManagerService = notificationManagerService;
    }

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
                        .title(event.getTitle())
                        .content(event.getMessage())
                ;



        notificationManagerService.handleNotification(notificationBuilder.build());
    }
}