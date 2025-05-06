package com.helios.auctix.repositories;

import com.helios.auctix.domain.notification.preferences.NotificationEventPreference;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface NotificationEventPreferencesRepository extends CrudRepository<NotificationEventPreference, UUID> {
    Optional<NotificationEventPreference> findByUserId(UUID userId);
}
