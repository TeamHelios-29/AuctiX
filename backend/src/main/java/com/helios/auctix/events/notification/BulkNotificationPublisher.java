package com.helios.auctix.events.notification;

import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BulkNotificationPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public void publish(List<User> users, String title, String message, NotificationCategory category) {
        if (users == null || users.isEmpty()) {
            return;
        }

        BulkNotificationEvent event = new BulkNotificationEvent(this, users, title, message, category);
        eventPublisher.publishEvent(event);
    }
}