package com.helios.auctix.events.notification;

import com.helios.auctix.domain.notification.Notification;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.events.notification.BulkNotificationEvent;
import com.helios.auctix.services.notification.NotificationManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class BulkNotificationEventListener {

    private final NotificationManagerService notificationManagerService;
    private final ThreadPoolTaskExecutor notificationExecutor;

    @EventListener
    @Async
    public void handleBulkNotification(BulkNotificationEvent event) {
        List<Notification> notifications = event.getUsers().stream()
                .map(user -> Notification.builder()
                        .user(user)
                        .title(event.getTitle())
                        .content(event.getMessage())
                        .notificationCategory(event.getNotificationCategory())
                        .build()
                )
                .toList();

        notificationManagerService.handleBulkNotifications(notifications);
    }
}
