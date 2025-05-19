package com.helios.auctix.services.notification;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.domain.notification.preferences.NotificationEventPreference;
import com.helios.auctix.domain.notification.preferences.NotificationGlobalPreference;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.notification.NotificationPreferenceUpdateDto;
import com.helios.auctix.dtos.notification.NotificationPreferencesResponseDto;
import com.helios.auctix.mappers.NotificationPreferenceResponseDTOMapper;
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
    private final NotificationPreferenceResponseDTOMapper preferencesDTOMapper;
    private final ObjectMapper objectMapper;

    public NotificationSettingsService(NotificationGlobalPreferencesRepository notificationGlobalPreferencesRepository, NotificationEventPreferencesRepository notificationEventPreferencesRepository, NotificationPreferenceResponseDTOMapper preferencesDTOMapper, ObjectMapper objectMapper) {
        this.notificationGlobalPreferencesRepository = notificationGlobalPreferencesRepository;
        this.notificationEventPreferencesRepository = notificationEventPreferencesRepository;
        this.preferencesDTOMapper = preferencesDTOMapper;
        this.objectMapper = objectMapper;
    }


    public Set<NotificationType> resolveNotificationPreference(NotificationCategory category, User user) {
        Set<NotificationType> enabledNotificationTypesForEvent = new HashSet<>();
        Set<NotificationType> globallyEnabledNotificationTypes = new HashSet<>();

        try {

            // Check the preferences for event categories
            Optional<NotificationEventPreference> eventPreference = notificationEventPreferencesRepository.findByUserId(user.getId());
            if (eventPreference.isPresent()) {
                // settings will be a string of   {"PROMO" : { "EMAIL": true, "PUSH": false }, "BID_WIN" : { "EMAIL": true, "PUSH": false } }
                Map<NotificationCategory, Map<NotificationType, Boolean>> eventPreferenceSettings = getSettingsNotificationTypesForEventCategories(eventPreference.get().getSettings());

                Map<NotificationType, Boolean> categorySettings = eventPreferenceSettings.get(category);
                if (categorySettings != null) {
                    for (Map.Entry<NotificationType, Boolean> entry : categorySettings.entrySet()) {
                        if (Boolean.TRUE.equals(entry.getValue())) {
                            enabledNotificationTypesForEvent.add(entry.getKey());
                        }
                    }
                }
            } else {
                // fall back is default notification preferences when there is no event category settings
                Map<NotificationCategory, Set<NotificationType>> defaultPreferences = setDefaultPreferences();
                log.info( "Fallback to default preferences for category");

                enabledNotificationTypesForEvent = defaultPreferences.get(category);
            }

            // Get the global notification preferences set for the user
            Optional<NotificationGlobalPreference> globalPreference = notificationGlobalPreferencesRepository.findByUserId(user.getId());
            if (globalPreference.isPresent()) {
                Map<NotificationType, Boolean> globalNotificationPreference = getSettingsGlobalNotificationPreference(globalPreference.get().getSettings());

                globallyEnabledNotificationTypes = globalNotificationPreference.entrySet().stream()
                        .filter(entry -> Boolean.TRUE.equals(entry.getValue()))
                        .map(Map.Entry::getKey) // get the NotificationType
                        .collect(Collectors.toSet());
            }

            // Filter so that global preference overrides, event preference
            // Only include notification types that are enabled both at event level and globally
            return enabledNotificationTypesForEvent.stream()
                    .filter(globallyEnabledNotificationTypes::contains)
                    .collect(Collectors.toSet());


        } catch (JsonProcessingException e) {
            log.error("Error resolving notification preferences for user {} for category {}. Falling back to defaults. Error: {}", user.getUsername(), category, e.getMessage());
//            e.printStackTrace();
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

    public void savePreferences(User user, @Valid NotificationPreferenceUpdateDto dto) {
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

     public NotificationPreferencesResponseDto getPreferences(User user) {

        Optional<NotificationEventPreference> eventPreferenceOptional = notificationEventPreferencesRepository.findByUserId(user.getId());
        Optional<NotificationGlobalPreference> globalPreferenceOptional = notificationGlobalPreferencesRepository.findByUserId(user.getId());

         // Set as null if no preference exist, the NotificationPreferencesResponseDtoMapper will handle the null and replace with the default preferences
         // TODO handle missing default preferences, which can happen when we add a new event preference
         NotificationEventPreference eventPreference = eventPreferenceOptional.orElse(null);
         NotificationGlobalPreference globalPreference = globalPreferenceOptional.orElse(null);

         return preferencesDTOMapper.toDTO(globalPreference, eventPreference);
     }
}
