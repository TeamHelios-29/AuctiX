package com.helios.auctix.domain.notification;

/**
 * Enum representing different categories of notifications.
 */
public enum NotificationCategory {
    DEFAULT,    // General notifications
    AUCTION,    // Auction-related notifications (new, ended, won, etc.)
    DELIVERY,   // Delivery-related notifications (created, status updates, etc.)
    PAYMENT,    // Payment-related notifications
    SYSTEM,     // System notifications (maintenance, updates, etc.)
    PROMO,      // Promotional notifications
    AUCTION_WON, // Auction won notification
    AUCTION_COMPLETED, // Auction completed notification
    BID_PLACED, // Bid placed notification
    BID_OUTBID  // Outbid notification
}