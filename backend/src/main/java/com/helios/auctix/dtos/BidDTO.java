package com.helios.auctix.dtos;

import lombok.Builder;
import lombok.Data;
//import lombok.NoArgsConstructor;

import java.time.Instant;
//import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BidDTO {
    private UUID id;
    private UUID auctionId;
    private Double amount;
    private Instant bidTime;
    private UserDTO bidder;
}

