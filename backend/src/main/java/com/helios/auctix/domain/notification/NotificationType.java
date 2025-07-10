package com.helios.auctix.domain.notification;

import lombok.Getter;

// the type of the notification channel
@Getter
public enum NotificationType {
    EMAIL("Email Notifications", "Receive notifications via email", "email"),
    PUSH("Push Notifications", "Receive notifications on web or device when the browser is open", "bell");

    private final String title;
    private final String description;
    private final String UIIcon;


    NotificationType(String title, String description, String UIIcon) {
        this.title = title;
        this.description = description;
        this.UIIcon = UIIcon;
    }

}
