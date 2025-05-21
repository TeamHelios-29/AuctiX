package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryCreateDTO {
    private UUID auctionId;
    private UUID buyerId;
    private String deliveryDate;
    private String deliveryAddress;
    private String notes;
}