package com.helios.auctix.domain.notification;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;
import com.helios.auctix.domain.user.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notifications")
@ToString(exclude = "user") // or else we get cyclic dependency
public class Notification {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String notificationEvent; // TODO: Decide if we are gonna store the events separately in the db

    @Deprecated
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Enumerated(EnumType.STRING)
    private NotificationCategory notificationCategory;

    @Enumerated(EnumType.STRING)
    private NotificationCategoryGroup notificationCategoryGroup;

    private String title;

    private String content;

    @Column(name="partial_url", length = 1000, nullable = true)
    private String partialUrl; // e.g. "/auction-details/123-123123"

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;  

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;  

    @Column(name = "is_read")
    private boolean read;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.notificationCategoryGroup = notificationCategory.getCategoryGroup();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
