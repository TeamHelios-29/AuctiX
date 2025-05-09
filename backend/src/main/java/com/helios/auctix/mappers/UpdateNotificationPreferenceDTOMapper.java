//package com.helios.auctix.mappers;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.helios.auctix.config.defaults.NotificationPreferenceProperties;
//import com.helios.auctix.domain.notification.NotificationCategory;
//import com.helios.auctix.domain.notification.NotificationType;
//import com.helios.auctix.domain.notification.preferences.NotificationEventPreference;
//import com.helios.auctix.domain.notification.preferences.NotificationGlobalPreference;
//import com.helios.auctix.domain.user.User;
//import com.helios.auctix.dtos.notification.NotificationPreferencesResponseDto;
//import org.springframework.stereotype.Component;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Component
//public class UpdateNotificationPreferenceDTOMapper {
//
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    public NotificationGlobalPreference toGlobalPreference(User user, NotificationPreferencesResponseDto dto) {
//        if (dto == null || dto.getGlobal() == null) return null;
//
//        try {
//            return NotificationGlobalPreference.builder()
//                    .user(user)
//                    .settings(objectMapper.writeValueAsString(dto.getGlobal()))
//                    .build();
//
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException("Failed to serialize global preferences", e);
//        }
//    }
//
//    public NotificationEventPreference toEventPreference(User user, NotificationPreferencesResponseDto dto) {
//        if (dto == null || dto.getEvents() == null) return null;
//
//        try {
//            return NotificationEventPreference.builder()
//                    .user(user)
//                    .settings(objectMapper.writeValueAsString(dto.getEvents()))
//                    .build();
//
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException("Failed to serialize event preferences", e);
//        }
//    }
//
//}
