package com.helios.auctix.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
@ConfigurationProperties(prefix = "superadmin")
public class SupperAdminConfig {
    private String email;
    private String password;
    private String username;
}