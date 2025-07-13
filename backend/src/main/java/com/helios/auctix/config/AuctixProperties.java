package com.helios.auctix.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@ConfigurationProperties(prefix = "auctix")
@Getter
@Setter
public class AuctixProperties {
    private String frontendUrl;

    /**
     * Converts a relative URL to a full URL using the configured frontend base URL.
     *
     * @param relativePath the relative URL path (e.g., "/auctions/123")
     * @return a full URL (e.g., "https://auctix.com/auctions/123"), or null if the input is blank
     */
    public String convertToFullUrl(String relativePath) {
        if (!StringUtils.hasText(relativePath)) {
            return null;
        }

        String base = frontendUrl;
        if (!base.endsWith("/")) {
            base += "/";
        }

        if (relativePath.startsWith("/")) {
            relativePath = relativePath.substring(1);
        }

        return base + relativePath;
    }

}
