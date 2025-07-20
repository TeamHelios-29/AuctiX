package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

// SellerAuctionDTO.java - For displaying auctions in manage auctions table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerAuctionDTO {
    private String id;
    private String title;
    private String startTime;
    private String endTime;
    private double startingPrice;
    private double currentBid;
    private int bidCount;
    private String status; // ONGOING, UPCOMING, ENDED, UNLISTED, DELETED, PENDING_ADMIN_APPROVAL
    private boolean isPublic;
    private boolean isDeleted;
    private String deletionStatus;
    private String createdAt;
    private String updatedAt;
}
