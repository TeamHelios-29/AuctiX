package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

// AuctionUpdateFormDTO.java - For prefilling update form
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionUpdateFormDTO {
    private String id;
    private String title;
    private String description;
    private double startingPrice;
    private String startTime;
    private String endTime;
    private boolean isPublic;
    private String category;
    private List<String> images;
    private boolean hasBids;
    private boolean canFullyEdit;
}