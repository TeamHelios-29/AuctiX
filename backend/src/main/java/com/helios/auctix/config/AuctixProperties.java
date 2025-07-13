package com.helios.auctix.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auctix")
@Getter
@Setter
public class AuctixProperties {
    private String frontendUrl;
}
