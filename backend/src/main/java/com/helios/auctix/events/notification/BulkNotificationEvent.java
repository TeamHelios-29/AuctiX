package com.helios.auctix.events.notification;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.List;

@Getter
public class BulkNotificationEvent extends ApplicationEvent {

    private final List<User> users;
    private final String title;
    private final String message;
    private final NotificationCategory notificationCategory;

    public BulkNotificationEvent(Object source, List<User> users, String title, String message,
                                 NotificationCategory notificationCategory) {
        super(source);
        this.users = users;
        this.title = title;
        this.message = message;
        this.notificationCategory = notificationCategory;
    }

}
