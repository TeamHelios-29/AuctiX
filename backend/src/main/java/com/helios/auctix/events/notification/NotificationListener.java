package com.helios.auctix.events.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.services.notification.NotificationManagerService;
import lombok.extern.java.Log;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Log
@Component
public class NotificationListener implements ApplicationListener<NotificationEvent> {


    private final NotificationManagerService notificationManagerService;

    NotificationListener(NotificationManagerService notificationManagerService) {
        this.notificationManagerService = notificationManagerService;
    }

    @Override
    public void onApplicationEvent(NotificationEvent event) {
        log.info("Received spring event - " + event.getMessage());

        NotificationCategory notificationCategory = event.getNotificationCategory();

        Notification.NotificationBuilder notificationBuilder =
                Notification
                        .builder()
                        .user(event.getUserToNotify())
                        .notificationCategory(event.getNotificationCategory())
                        .notificationEvent(event.toString()) // TODO decide if we are storing this
                        .title(event.getTitle())
                        .content(event.getMessage())
                        .partialUrl(event.getPartialUrl());


        notificationManagerService.handleNotification(notificationBuilder.build());
    }
}