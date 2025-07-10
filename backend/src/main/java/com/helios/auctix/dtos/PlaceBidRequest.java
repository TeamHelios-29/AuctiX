package com.helios.auctix.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.UUID;

@Data
public class PlaceBidRequest {
    @NotNull
    private UUID auctionId;

    @Positive
    @NotNull
    private Double amount;
}
