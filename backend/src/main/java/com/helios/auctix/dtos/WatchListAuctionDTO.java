package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WatchListAuctionDTO {
    private AuctionDetailsDTO auction;

    private boolean isOutbid;
    private boolean isHighestBidder;
    private Double userBidAmount;
}
