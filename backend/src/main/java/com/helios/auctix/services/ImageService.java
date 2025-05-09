//package com.helios.auctix.services;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ImageService {
//    @Value("${spring.cloud.azure.storage.blob.account-name}")
//    private String accountName;
//
//    @Value("${spring.cloud.azure.storage.blob.container-name}")
//    private String containerName;
//
//    @Value("${spring.cloud.azure.storage.blob.host}")
//    private String host;
//
//    public List<String> getImageUrl(List<String> imageIds) {
//        // Construct the public URL for the image
//        return String.format("%s/%s/%s", host, containerName, imageIds);
//    }
//
//}
