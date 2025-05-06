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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    /**
     *  Settings column will have a json with the preferences in the format similar to :
     *  {"PROMO" : { "EMAIL": true, "PUSH": false }, "BID_WIN" : { "EMAIL": true, "PUSH": false } }
     */
    @Column(name = "settings", columnDefinition = "jsonb")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String settings;

}
