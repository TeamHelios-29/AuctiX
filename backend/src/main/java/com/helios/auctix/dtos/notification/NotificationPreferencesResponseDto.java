package com.helios.auctix.dtos.notification;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationPreferencesResponseDto {
    private Map<String, GlobalChannelSetting> global;
    private Map<String, Map<String, EventSetting>> events;

    @Nullable
    @Data
    @Builder
    public static class GlobalChannelSetting {
        private boolean enabled;
        private String title;
        private String description;
        private String UIIcon;
    }

    @Nullable
    @Data
    @Builder
    public static class EventSetting {
        private String title;
        private String description;
        private String categoryGroup;
        private Map<String, Boolean> channelTypes;
    }


}