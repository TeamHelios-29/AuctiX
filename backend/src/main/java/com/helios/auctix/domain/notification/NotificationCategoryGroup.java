package com.helios.auctix.domain.notification;

import lombok.Getter;

/**
 *  Notification categories can be grouped together for example AUCTION group could have AUCTION_START, AUCTION_END, AUCTION_STARTS_SOON etc
 */
@Getter
public enum NotificationCategoryGroup {

    DEFAULT, PROMO, AUCTION
}
