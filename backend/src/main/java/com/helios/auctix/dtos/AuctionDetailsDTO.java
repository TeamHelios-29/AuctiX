package com.helios.auctix.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDetailsDTO {
    private String id;
    private String category;
    private String title;
    private String description;
    private List<String> images;
    private UserDTO seller;

//    private double startingPrice;
//    private double currentBid;
//    private double bidIncrement;
//    private BidderDTO currentBidder;
//    private SellerDTO seller;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private String endTime;
    private String startTime;
//    private List<BidHistoryDTO> bidHistory;
//    private ProductOwnerDTO productOwner;
}
