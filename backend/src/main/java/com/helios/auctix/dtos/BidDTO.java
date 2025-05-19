package com.helios.auctix.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BidDTO {
    private UUID id;
    private UUID auctionId;
//    private UUID bidderId;
//    private String bidderName;
//    private String bidderAvatar;
    private Double amount;
    private Instant bidTime;
    private BidderDTO bidder;
}

