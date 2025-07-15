package com.helios.auctix.events.notification;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.notification.NotificationCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.lang.Nullable;

import lombok.extern.java.Log;

@Log
@Component
public class NotificationEventPublisher {
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public void publishNotificationEvent(
            final String title,
            final String message,
            final NotificationCategory notificationCategory,
            User userToNotify,
            @Nullable String partialUrl // optional partial URL
    ) {
        log.info("Publishing event " + message + " " + notificationCategory);
        NotificationEvent customSpringEvent = new NotificationEvent(this, title, message, notificationCategory, userToNotify, partialUrl );
        applicationEventPublisher.publishEvent(customSpringEvent);
    }
}