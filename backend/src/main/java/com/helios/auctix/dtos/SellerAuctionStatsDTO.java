package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// SellerAuctionStatsDTO.java - For displaying statistics
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerAuctionStatsDTO {
    private int totalAuctions;
    private int ongoingAuctions;
    private int upcomingAuctions;
    private int completedAuctions;
    private int unlistedAuctions;
    private int deletedAuctions;
}