package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// AuctionUpdateRequest.java - For update requests
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionUpdateRequestDTO {
    private String title;
    private String description;
    private double startingPrice;
    private String startTime;
    private String endTime;
    private boolean isPublic;
    private String category;
    private List<MultipartFile> images;
}


