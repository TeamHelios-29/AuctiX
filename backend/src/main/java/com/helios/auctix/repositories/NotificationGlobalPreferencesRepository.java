package com.helios.auctix.repositories;

import com.helios.auctix.domain.notification.preferences.NotificationGlobalPreference;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface NotificationGlobalPreferencesRepository extends CrudRepository<NotificationGlobalPreference, UUID> {
}
