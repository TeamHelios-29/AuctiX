package com.helios.auctix.domain.notification.preferences;

import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notification_global_preferences")
public class NotificationGlobalPreference {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private User user;

    /**
     *  Settings column will have a json with the preferences in the format similar to : { "email": true, "push": false }
     */
    @Column(columnDefinition = "jsonb")
    private String settings;

}
