package com.helios.auctix.domain.notification;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "auction_notification_log", indexes = {
        @Index(name = "idx_auction_id", columnList = "auction_id"),
        @Index(name = "idx_category", columnList = "category")
})
public class AuctionNotificationLog {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "uuid")
    private UUID id;

    @Column(name = "auction_id", nullable = false, columnDefinition = "uuid")
    private UUID auctionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 32)
    private NotificationCategory category;

    @Column(name = "sent_at", nullable = false)
    private Instant sentAt;

    // Constructors, getters, setters

    public AuctionNotificationLog() {}

    public AuctionNotificationLog(UUID auctionId, NotificationCategory category, Instant sentAt) {
        this.auctionId = auctionId;
        this.category = category;
        this.sentAt = sentAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(UUID auctionId) {
        this.auctionId = auctionId;
    }

    public NotificationCategory getCategory() {
        return category;
    }

    public void setCategory(NotificationCategory category) {
        this.category = category;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }
}
