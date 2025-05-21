package com.helios.auctix.dtos;

import com.helios.auctix.domain.notification.NotificationCategory;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record NotificationResponseDto(
        UUID id,
        String title,
        String content,
        boolean read,
        String notificationCategory,
        String notificationCategoryGroup,
        LocalDateTime createdAt
) {
}
