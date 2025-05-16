package com.helios.auctix.config.defaults;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "notification.defaults")
public class NotificationPreferenceProperties {

    @Setter
    @Getter
    private Map<String, Boolean> global = new HashMap<>();
    @Setter
    @Getter
    private Map<String, Map<String, Boolean>> events = new HashMap<>();

    private final Map<String, Boolean> defaultGlobal = Map.of(
            "EMAIL", true,
            "PUSH", true
    );

    private final Map<String, Map<String, Boolean>> defaultEvents = Map.of(
            "PROMO", Map.of("EMAIL", true, "PUSH", false),
//            "BID_WIN", Map.of("EMAIL", true, "PUSH", false),
            "DEFAULT", Map.of("EMAIL", true, "PUSH", true)

    );

    @PostConstruct
    public void mergeDefaults() {
        // Merge global preferences per key
        defaultGlobal.forEach((key, defaultVal) -> {
            global.putIfAbsent(key, defaultVal);
        });

        // Merge event preferences per event and per channel
        defaultEvents.forEach((event, defaultChannelMap) -> {
            Map<String, Boolean> merged = new HashMap<>(defaultChannelMap);
            Map<String, Boolean> overridden = events.getOrDefault(event, new HashMap<>());

            // Override defaults with properties
            merged.putAll(overridden);

            events.put(event, merged);
        });
    }

}
