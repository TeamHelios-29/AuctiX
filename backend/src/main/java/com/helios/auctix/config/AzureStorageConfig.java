package com.helios.auctix.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Getter
@Setter
@ConfigurationProperties(prefix = "spring.cloud.azure.storage.blob")
public class AzureStorageConfig {
    private String accountName;
    private String accountKey;
    private String containerName;
    private String host;
    private Boolean sslEnabled;
    private Integer port;

    public URI getStorageContainerURI() throws URISyntaxException {
        URI StorageContainer = new URI(
                        this.getSslEnabled() ? "https:" : "http:" +
                        "//" +
                        this.getHost() +
                        ":" +
                        this.getPort() +
                        "/devstoreaccount1/" +
                        this.getContainerName());

        return StorageContainer;
    }

}