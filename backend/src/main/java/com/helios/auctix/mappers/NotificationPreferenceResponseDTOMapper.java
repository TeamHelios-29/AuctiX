package com.helios.auctix.mappers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.helios.auctix.config.defaults.NotificationPreferenceDefaultsProperties;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.notification.NotificationType;
import com.helios.auctix.domain.notification.preferences.NotificationEventPreference;
import com.helios.auctix.domain.notification.preferences.NotificationGlobalPreference;
import com.helios.auctix.dtos.notification.NotificationPreferencesResponseDto;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class NotificationPreferenceResponseDTOMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final NotificationPreferenceDefaultsProperties defaultProperties;

    public NotificationPreferenceResponseDTOMapper(NotificationPreferenceDefaultsProperties defaultProperties) {
        this.defaultProperties = defaultProperties;
    }

    public NotificationPreferencesResponseDto toDTO(NotificationGlobalPreference global, NotificationEventPreference event) {
        Map<String, Boolean> globalRaw;
        Map<String, Map<String, Boolean>> eventsRaw;

        try {
            globalRaw = (global != null && global.getSettings() != null)
                    ? objectMapper.readValue(global.getSettings(), new TypeReference<>() {})
                    : defaultProperties.getGlobal();

            eventsRaw = (event != null && event.getSettings() != null)
                    ? objectMapper.readValue(event.getSettings(), new TypeReference<>() {})
                    : defaultProperties.getEvents();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize preferences", e);
        }

        // Global settings with metadata
        Map<String, NotificationPreferencesResponseDto.GlobalChannelSetting> globalMap = new HashMap<>();
        for (NotificationType type : NotificationType.values()) {
            boolean enabled = globalRaw.getOrDefault(type.name(), false);
            globalMap.put(type.name(), NotificationPreferencesResponseDto.GlobalChannelSetting.builder()
                    .enabled(enabled)
                    .title(type.getTitle())
                    .description(type.getDescription())
                    .UIIcon(type.getUIIcon())
                    .build());
        }

        // Events categorized by group
        Map<String, Map<String, NotificationPreferencesResponseDto.EventSetting>> groupedEvents = new HashMap<>();
        for (NotificationCategory category : NotificationCategory.values()) {
            String categoryId = category.name();
            String group = category.getCategoryGroup().name();
            Map<String, Boolean> channelPrefs = eventsRaw.getOrDefault(categoryId, Map.of());

            // Channels for this category
            Map<String, Boolean> channelsMap = new HashMap<>();
            for (NotificationType type : NotificationType.values()) {
                channelsMap.put(type.name(), channelPrefs.getOrDefault(type.name(), false));
            }

            NotificationPreferencesResponseDto.EventSetting eventSetting =
                    NotificationPreferencesResponseDto.EventSetting.builder()
                            .title(category.getTitle())
                            .description(category.getDescription())
                            .categoryGroup(group)
                            .channelTypes(channelsMap)
                            .build();

            groupedEvents.computeIfAbsent(group, g -> new HashMap<>())
                    .put(categoryId, eventSetting);
        }

        return NotificationPreferencesResponseDto.builder()
                .global(globalMap)
                .events(groupedEvents)
                .build();
    }
}
