package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDetailsDTO {
    private Long id;
    private String title;
    private String description;
    private Double startingPrice;
    private Double currentBid;
    private Double bidIncrement;
    private Instant startTime;
    private Instant endTime;
    private String category;
    private List<String> imagePaths;
    private BidderDTO currentBidder;
    private SellerDTO seller;
    private List<BidHistoryDTO> bidHistory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BidderDTO {
        private Long id;
        private String name;
        private String avatar;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerDTO {
        private Long id;
        private String name;
        private String avatar;
        private Double rating;
        private Instant joinedDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BidHistoryDTO {
        private BidderDTO bidder;
        private Double amount;
        private Instant timestamp;
    }
}