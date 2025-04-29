package com.helios.auctix.services.notification;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.domain.notification.preferences.NotificationEventPreference;
import com.helios.auctix.domain.notification.preferences.NotificationGlobalPreference;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.NotificationEventPreferencesRepository;
import com.helios.auctix.repositories.NotificationGlobalPreferencesRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NotificationSettingsService {


    private final NotificationGlobalPreferencesRepository notificationGlobalPreferencesRepository;
    private final NotificationEventPreferencesRepository notificationEventPreferencesRepository;
    private final ObjectMapper objectMapper;

    public NotificationSettingsService(NotificationGlobalPreferencesRepository notificationGlobalPreferencesRepository, NotificationEventPreferencesRepository notificationEventPreferencesRepository, ObjectMapper objectMapper) {
        this.notificationGlobalPreferencesRepository = notificationGlobalPreferencesRepository;
        this.notificationEventPreferencesRepository = notificationEventPreferencesRepository;
        this.objectMapper = objectMapper;
    }


    public Set<NotificationType> resolveNotificationPreference(NotificationCategory category, User user) {
        Set<NotificationType> enabledNotificationTypes = new HashSet<>();
        try {

            // * 1st check the preferences for event categories
            Optional<NotificationEventPreference> eventPreference = notificationEventPreferencesRepository.findById(user.getId());
            if (eventPreference.isPresent()) {
                // settings will be a string of   {"PROMO" : { "email": true, "push": false }, "BID_WIN" : { "email": true, "push": false } }
                Map<NotificationCategory, Map<NotificationType, Boolean>> eventPreferenceSettings = getSettingsNotificationTypesForEventCategories(eventPreference.get().getSettings());

                Map<NotificationType, Boolean> categorySettings = eventPreferenceSettings.get(category);
                if (categorySettings != null) {
                    for (Map.Entry<NotificationType, Boolean> entry : categorySettings.entrySet()) {
                        if (Boolean.TRUE.equals(entry.getValue())) {
                            enabledNotificationTypes.add(entry.getKey());
                        }
                    }

                    // Since event-specific preference exists for this notification event category, return it
                    return enabledNotificationTypes;
                }
            }

            // 2nd check if there are global notification preferences set for the user
            Optional<NotificationGlobalPreference> globalPreference = notificationGlobalPreferencesRepository.findById(user.getId());
            if (globalPreference.isPresent()) {
                Map<NotificationType, Boolean> globalNotificationPreference = getSettingsGlobalNotificationPreference(globalPreference.get().getSettings());

                enabledNotificationTypes = globalNotificationPreference.entrySet().stream()
                        .filter(entry -> Boolean.TRUE.equals(entry.getValue()))
                        .map(Map.Entry::getKey) // get the NotificationType
                        .collect(Collectors.toSet());


                // We return the global settings since we found them
                return enabledNotificationTypes;


            }

            // Last fall back is default notification preferences when there is no event category settings
            Map<NotificationCategory, Set<NotificationType>> defaultPreferences = setDefaultPreferences();

            enabledNotificationTypes = defaultPreferences.get(category);

            return enabledNotificationTypes;

        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


    }

    /**
     * Get the preferences of the user for the event categories
     *
     * @param settingsJsonString event notification settings as a json format similar to - {"PROMO" : { "email": true, "push": false }, "BID_WIN" : { "email": true, "push": false } }
     * @return Map<NotificationCategory, Map < NotificationType, Boolean>> eventCategoryNotificationSettings
     * @throws JsonProcessingException
     */
    private Map<NotificationCategory, Map<NotificationType, Boolean>> getSettingsNotificationTypesForEventCategories(String settingsJsonString) throws JsonProcessingException {
        Map<NotificationCategory, Map<NotificationType, Boolean>> settings = new HashMap<>();

        return objectMapper.readValue(
                settingsJsonString,
                new TypeReference<Map<NotificationCategory, Map<NotificationType, Boolean>>>() {
                }
        );
    }

    /**
     * Get the global preferences of the user for notification delivery types
     *
     * @param settingsJsonString global notification settings as a json in a format similar to - { "email" : true, "push": false }
     * @return Map<NotificationType, Boolean> globalNotificationSettings
     * @throws JsonProcessingException
     */
    private Map<NotificationType, Boolean> getSettingsGlobalNotificationPreference(String settingsJsonString) throws JsonProcessingException {
        Map<NotificationType, Boolean> settings = new HashMap<>();

        return objectMapper.readValue(
                settingsJsonString,
                new TypeReference<Map<NotificationType, Boolean>>() {
                }
        );
    }

    private Map<NotificationCategory, Set<NotificationType>> setDefaultPreferences() {
        Map<NotificationCategory, Set<NotificationType>> defaultPreferences = new HashMap<>();

        // Set default preferences like this for now
        defaultPreferences.put(NotificationCategory.DEFAULT, Set.of(
                NotificationType.EMAIL,
//                NotificationType.WEBSOCKET,
                NotificationType.PUSH
        ));

        defaultPreferences.put(NotificationCategory.PROMO, Set.of(
                NotificationType.EMAIL,
                NotificationType.PUSH
        ));

        return defaultPreferences;
    }

}
