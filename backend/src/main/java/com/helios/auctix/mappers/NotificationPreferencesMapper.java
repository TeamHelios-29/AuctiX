package com.helios.auctix.mappers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.helios.auctix.config.defaults.NotificationPreferenceProperties;
import com.helios.auctix.domain.notification.preferences.NotificationEventPreference;
import com.helios.auctix.domain.notification.preferences.NotificationGlobalPreference;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.NotificationPreferencesDTO;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class NotificationPreferencesMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final NotificationPreferenceProperties defaultProperties;

    public NotificationPreferencesMapper(NotificationPreferenceProperties defaultProperties) {
        this.defaultProperties = defaultProperties;
    }

    public NotificationGlobalPreference toGlobalPreference(User user, NotificationPreferencesDTO dto) {
        if (dto == null || dto.getGlobal() == null) return null;

        try {
            return NotificationGlobalPreference.builder()
                    .user(user)
                    .settings(objectMapper.writeValueAsString(dto.getGlobal()))
                    .build();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize global preferences", e);
        }
    }

    public NotificationEventPreference toEventPreference(User user, NotificationPreferencesDTO dto) {
        if (dto == null || dto.getEvents() == null) return null;

        try {
            return NotificationEventPreference.builder()
                    .user(user)
                    .settings(objectMapper.writeValueAsString(dto.getEvents()))
                    .build();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize event preferences", e);
        }
    }

    public NotificationPreferencesDTO toDTO(NotificationGlobalPreference global, NotificationEventPreference event) {
        NotificationPreferencesDTO dto = new NotificationPreferencesDTO();

        try {
            if (global != null && global.getSettings() != null) {
                dto.setGlobal(objectMapper.readValue(global.getSettings(), new TypeReference<>() {}));
            } else {
                dto.setGlobal(defaultProperties.getGlobal());
            }
            if (event != null && event.getSettings() != null) {
                dto.setEvents(objectMapper.readValue(event.getSettings(), new TypeReference<>() {}));
            } else {
                dto.setEvents(defaultProperties.getEvents());
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize preferences", e);
        }

        return dto;
    }
}
