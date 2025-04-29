package com.helios.auctix.domain.notification.preferences;

import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notification_event_preferences")
public class NotificationEventPreference {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private User user;

    /**
     *  Settings column will have a json with the preferences in the format similar to :
     *  {"PROMO" : { "email": true, "push": false }, "BID_WIN" : { "email": true, "push": false } }
     *  }
     */
    @Column(columnDefinition = "jsonb")
    private String settings;

    @PrePersist
    public void prePersist() {
        if (user != null && user.getId() != null) {
            userId = user.getId();
        }
        if (userId == null) {
            throw new IllegalStateException("userId cannot be null for NotificationGlobalPreferences");
        }
    }

}
