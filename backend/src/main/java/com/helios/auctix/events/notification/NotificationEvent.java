package com.helios.auctix.events.notification;

import com.helios.auctix.domain.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import org.springframework.context.ApplicationEvent;


public class NotificationEvent  extends ApplicationEvent {

    private final String title;

    private final String message;

    private final NotificationCategory notificationCategory;

    private final User userToNotify;

    public NotificationEvent(Object source, String title, String message, NotificationCategory notificationCategory, User userToNotify) {
        super(source);
        this.title = title;
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

    public String getTitle() {
        return title;
    }
}