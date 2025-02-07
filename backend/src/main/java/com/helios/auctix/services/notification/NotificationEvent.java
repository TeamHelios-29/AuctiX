package com.helios.auctix.services.notification;

import com.helios.auctix.domain.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import org.springframework.context.ApplicationEvent;


public class NotificationEvent  extends ApplicationEvent {
    private final String message;

    private final NotificationCategory notificationCategory;

    private final User userToNotify;

    public NotificationEvent(Object source, String message, NotificationCategory notificationCategory, User userToNotify) {
        super(source);
        this.message = message;
        this.notificationCategory = notificationCategory;
        this.userToNotify = userToNotify;
    }

    public String getMessage() {
        return message;
    }

    public NotificationCategory getNotificationCategory() {
        return notificationCategory;
    }

    public User getUserToNotify() {
        return userToNotify;
    }
}