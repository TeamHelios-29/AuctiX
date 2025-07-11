package com.helios.auctix.domain.notification;
import com.helios.auctix.domain.user.UserRoleEnum;
import lombok.Getter;

import java.util.Set;


@Getter
public enum NotificationCategory {
    /**
     * DEFAULT is used to send the notification via all the available senders
     */
    DEFAULT("Default Notifications", "All other notifications", NotificationCategoryGroup.DEFAULT),
    PROMO("Promotional Notifications", "Marketing notifications about promotions, discounts", NotificationCategoryGroup.PROMO),
    AUCTION_START_SOON("Auction Start soon", "Get notified 10 minutes before auction starts", NotificationCategoryGroup.AUCTION),
    AUCTION_END_SOON("Auction Ends soon", "Get notified 10 minutes before auction ends", NotificationCategoryGroup.AUCTION),
    AUCTION_COMPLETED("Auction Completed", "Get notified when auction ends", NotificationCategoryGroup.AUCTION),
    AUCTION_WON("Auction Won", "Get notified after winning an auction", NotificationCategoryGroup.AUCTION),
    USER_REPORTED("User is reported", "Get a notification when a user gets reported",
            NotificationCategoryGroup.DEFAULT,
            Set.of(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN));

    private final String title;
    private final String description;
    private final NotificationCategoryGroup categoryGroup;
    private final Set<UserRoleEnum> allowedRoles;

    // Constructor for default: all roles allowed
    NotificationCategory(String title, String description, NotificationCategoryGroup group) {
        this(title, description, group, Set.of(UserRoleEnum.values())); // all roles for default
    }

    // Constructor for restricted roles
    NotificationCategory(String title, String description, NotificationCategoryGroup group, Set<UserRoleEnum> allowedRoles) {
        this.title = title;
        this.description = description;
        this.categoryGroup = group;
        this.allowedRoles = allowedRoles;
    }

    public boolean isNotAllowedTo(UserRoleEnum role) {
        return !allowedRoles.contains(role);
    }
}
