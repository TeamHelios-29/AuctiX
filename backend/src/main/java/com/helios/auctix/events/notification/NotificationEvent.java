package com.helios.auctix.events.notification;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import org.springframework.lang.Nullable;


@Getter
public class NotificationEvent  extends ApplicationEvent {

    private final String title;

    private final String message;

    private final NotificationCategory notificationCategory;

    private final User userToNotify;

    @Nullable
    private final String partialUrl;  // optional URL field

    public NotificationEvent(Object source, String title, String message, NotificationCategory notificationCategory, User userToNotify, @Nullable String partialUrl) {
        super(source);
        this.title = title;
        this.message = message;
        this.notificationCategory = notificationCategory;
        this.userToNotify = userToNotify;
        this.partialUrl = partialUrl;
    }

}