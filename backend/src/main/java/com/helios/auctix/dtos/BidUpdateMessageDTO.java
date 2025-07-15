package com.helios.auctix.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BidUpdateMessageDTO {
    private UUID auctionId;
    private BidDTO newBid;
    private List<BidDTO> bidHistory;
}

