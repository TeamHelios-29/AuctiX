package com.helios.auctix.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@Component
@ConfigurationProperties(prefix = "app.errors")
public class ErrorConfig {
    private boolean showDetailedErrors;

    public boolean isShowDetailed() {
        return showDetailedErrors;
    }

    public void setShowDetailed(boolean showDetailedErrors) {
        this.showDetailedErrors = showDetailedErrors;
    }
}

