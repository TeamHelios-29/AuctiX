package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RechargeRequestDTO {
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
}