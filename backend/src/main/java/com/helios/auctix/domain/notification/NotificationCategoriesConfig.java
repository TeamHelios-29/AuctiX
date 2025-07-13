package com.helios.auctix.domain.notification;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "")
public class NotificationCategoriesConfig {
    private Map<String, NotificationCategoryMetadata> notificationCategories;
}
