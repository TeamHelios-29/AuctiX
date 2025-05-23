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
import com.helios.auctix.dtos.NotificationPreferencesDTO;
import com.helios.auctix.mappers.NotificationPreferencesMapper;
import com.helios.auctix.repositories.NotificationEventPreferencesRepository;
import com.helios.auctix.repositories.NotificationGlobalPreferencesRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NotificationSettingsService {


    private final NotificationGlobalPreferencesRepository notificationGlobalPreferencesRepository;
    private final NotificationEventPreferencesRepository notificationEventPreferencesRepository;
    private final NotificationPreferencesMapper preferencesDTOMapper;
    private final ObjectMapper objectMapper;

    public NotificationSettingsService(NotificationGlobalPreferencesRepository notificationGlobalPreferencesRepository, NotificationEventPreferencesRepository notificationEventPreferencesRepository, NotificationPreferencesMapper preferencesDTOMapper, ObjectMapper objectMapper) {
        this.notificationGlobalPreferencesRepository = notificationGlobalPreferencesRepository;
        this.notificationEventPreferencesRepository = notificationEventPreferencesRepository;
        this.preferencesDTOMapper = preferencesDTOMapper;
        this.objectMapper = objectMapper;
    }


    public Set<NotificationType> resolveNotificationPreference(NotificationCategory category, User user) {
        Set<NotificationType> enabledNotificationTypes = new HashSet<>();
        try {

            // * 1st check the preferences for event categories
            Optional<NotificationEventPreference> eventPreference = notificationEventPreferencesRepository.findByUserId(user.getId());
//            log.info("Event preferences" + eventPreference.get().getSettings());
            if (eventPreference.isPresent()) {
                // settings will be a string of   {"PROMO" : { "EMAIL": true, "PUSH": false }, "BID_WIN" : { "EMAIL": true, "PUSH": false } }
                Map<NotificationCategory, Map<NotificationType, Boolean>> eventPreferenceSettings = getSettingsNotificationTypesForEventCategories(eventPreference.get().getSettings());

                Map<NotificationType, Boolean> categorySettings = eventPreferenceSettings.get(category);
                if (categorySettings != null) {
                    for (Map.Entry<NotificationType, Boolean> entry : categorySettings.entrySet()) {
                        if (Boolean.TRUE.equals(entry.getValue())) {
                            enabledNotificationTypes.add(entry.getKey());
                        }
                    }

                    log.info( "event specific notification preferences are found");
                    // Since event-specific preference exists for this notification event category, return it
                    return enabledNotificationTypes;
                }
            }

            // 2nd check if there are global notification preferences set for the user
            Optional<NotificationGlobalPreference> globalPreference = notificationGlobalPreferencesRepository.findByUserId(user.getId());
            if (globalPreference.isPresent()) {
                Map<NotificationType, Boolean> globalNotificationPreference = getSettingsGlobalNotificationPreference(globalPreference.get().getSettings());

                enabledNotificationTypes = globalNotificationPreference.entrySet().stream()
                        .filter(entry -> Boolean.TRUE.equals(entry.getValue()))
                        .map(Map.Entry::getKey) // get the NotificationType
                        .collect(Collectors.toSet());

                log.info( "global notification preferences are found");
                // We return the global settings since we found them
                return enabledNotificationTypes;


            }

            // Last fall back is default notification preferences when there is no event category settings
            Map<NotificationCategory, Set<NotificationType>> defaultPreferences = setDefaultPreferences();
            log.info( "Fallbacking to default preferencees");

            enabledNotificationTypes = defaultPreferences.get(category);

            return enabledNotificationTypes;

        } catch (JsonProcessingException e) {
            log.error("Error resolving notification preferences for user {} for category {}. Falling back to defaults. Error: {}", user.getUsername(), category, e.getMessage());
            e.printStackTrace();
            Map<NotificationCategory, Set<NotificationType>> defaultPreferences = setDefaultPreferences();
            return defaultPreferences.get(category);
        }
    }

    /**
     * Get the preferences of the user for the event categories
     *
     * @param settingsJsonString event notification settings as a json format similar to - {"PROMO" : { "EMAIL": true, "PUSH": false }, "BID_WIN" : { "EMAIL": true, "PUSH": false } }
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
     * @param settingsJsonString global notification settings as a json in a format similar to - { "EMAIL" : true, "PUSH": false }
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

    public void savePreferences(User user, @Valid NotificationPreferencesDTO dto) {
        if (dto.getGlobal() != null) {
            String globalSettingsJson = toJson(dto.getGlobal());

            NotificationGlobalPreference existingGlobalPref = notificationGlobalPreferencesRepository
                    .findByUserId(user.getId())
                    .orElse(null);

            if (existingGlobalPref != null) {
                existingGlobalPref.setSettings(globalSettingsJson);
                notificationGlobalPreferencesRepository.save(existingGlobalPref);
            } else {
                NotificationGlobalPreference globalPref = NotificationGlobalPreference.builder()
                        .user(user)
                        .settings(globalSettingsJson)
                        .build();
                notificationGlobalPreferencesRepository.save(globalPref);
            }
        }

        if (dto.getEvents() != null) {
            String eventSettingsJson = toJson(dto.getEvents());

            NotificationEventPreference existingEventPref = notificationEventPreferencesRepository
                    .findByUserId(user.getId())
                    .orElse(null);

            if (existingEventPref != null) {
                existingEventPref.setSettings(eventSettingsJson);
                notificationEventPreferencesRepository.save(existingEventPref);
            } else {
                NotificationEventPreference eventPref = NotificationEventPreference.builder()
                        .user(user)
                        .settings(eventSettingsJson)
                        .build();
                notificationEventPreferencesRepository.save(eventPref);
            }
        }
    }

    private String toJson(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize notification preferences", e);
        }
    }

     public NotificationPreferencesDTO getPreferences(User user) {

        Optional<NotificationEventPreference> eventPreferenceOptional = notificationEventPreferencesRepository.findByUserId(user.getId());
        Optional<NotificationGlobalPreference> globalPreferenceOptional = notificationGlobalPreferencesRepository.findByUserId(user.getId());

         // for now null if preferences don't exist
         NotificationEventPreference eventPreference = eventPreferenceOptional.orElse(null);
         NotificationGlobalPreference globalPreference = globalPreferenceOptional.orElse(null);

         return preferencesDTOMapper.toDTO(globalPreference, eventPreference);
     }
}
