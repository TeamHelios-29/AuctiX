package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidDTO {
    private UUID id;
    private UUID auctionId;
    private String auctionTitle;
    private UUID bidderId;
    private String bidderName;
    private String bidderAvatar;
    private Double amount;
    private Instant bidTime;
    private Instant createdAt;
}
