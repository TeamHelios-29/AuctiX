package com.helios.auctix.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Log
public class FirebaseConfig {

    @Value("${firebase.account-type}")
    private String accountType;

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.private-key-id}")
    private String privateKeyId;

    @Value("${firebase.private-key}")
    private String privateKey;

    @Value("${firebase.client-email}")
    private String clientEmail;

    @Value("${firebase.client-id}")
    private String clientId;

    @Value("${firebase.auth-uri}")
    private String authUri;

    @Value("${firebase.token-uri}")
    private String tokenUri;

    @Value("${firebase.auth-provider-cert-url}")
    private String authProviderCertUrl;

    @Value("${firebase.client-cert-url}")
    private String clientCertUrl;

    @Value("${firebase.universe-domain}")
    private String universeDomain;

    @PostConstruct
    public void initialize() {
        try {
            // Create the credentials map dynamically
            Map<String, String> credentialsMap = getCredentialsMap();

            // Convert Map to JSON using Jackson
            ObjectMapper objectMapper = new ObjectMapper();
            byte[] jsonData = objectMapper.writeValueAsBytes(credentialsMap);

            // Initialize Firebase with the credentials
            GoogleCredentials credentialsStream = GoogleCredentials.fromStream(new ByteArrayInputStream(jsonData));
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentialsStream)
                    .build();

            FirebaseApp.initializeApp(options);

            log.info("Firebase init success");

        } catch (IOException e) {
            log.severe("Failed to set the Firebase service account with error: " + e.getMessage());
//            e.printStackTrace();
        }
    }

    private Map<String, String> getCredentialsMap() {
        Map<String, String> credentialsMap = new HashMap<>();
        credentialsMap.put("type", accountType);
        credentialsMap.put("project_id", projectId);
        credentialsMap.put("private_key_id", privateKeyId);
        credentialsMap.put("private_key", privateKey);
        credentialsMap.put("client_email", clientEmail);
        credentialsMap.put("client_id", clientId);
        credentialsMap.put("auth_uri", authUri);
        credentialsMap.put("token_uri", tokenUri);
        credentialsMap.put("auth_provider_x509_cert_url", authProviderCertUrl);
        credentialsMap.put("client_x509_cert_url", clientCertUrl);
        credentialsMap.put("universe_domain", universeDomain);
        return credentialsMap;
    }
}
