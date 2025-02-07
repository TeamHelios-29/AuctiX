package com.helios.auctix.services.notification;

import com.helios.auctix.domain.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventPublisher {
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public void publishNotificationEvent(final String message, final NotificationCategory notificationCategory, User userToNotify) {
        System.out.println("Publishing event " + message + " " + notificationCategory);
        NotificationEvent customSpringEvent = new NotificationEvent(this, message, notificationCategory, userToNotify );
        applicationEventPublisher.publishEvent(customSpringEvent);
    }
}