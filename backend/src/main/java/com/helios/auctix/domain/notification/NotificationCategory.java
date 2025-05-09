package com.helios.auctix.domain.notification;

import lombok.Getter;

@Getter
public enum NotificationCategory {
    /**
     * DEFAULT is used to send the notification via all the available senders
     */
    DEFAULT("Default Notifications", "All other notifications", NotificationCategoryGroup.DEFAULT),
    PROMO("Promotional Notifications", "Marketing notifications about promotions, discounts", NotificationCategoryGroup.PROMO),
    AUCTION_START_SOON("Auction Start soon", "Get notified 10 minutes before auction starts", NotificationCategoryGroup.AUCTION);

    private final String title;
    private final String description;
    private final NotificationCategoryGroup categoryGroup;

    NotificationCategory(String title, String description, NotificationCategoryGroup categoryGroup) {
        this.title = title;
        this.description = description;
        this.categoryGroup = categoryGroup;
    }
}
