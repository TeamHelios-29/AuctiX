package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryUpdateDTO {
    private String deliveryDate;
    private String status;
    private String deliveryAddress;
    private String notes;
    private String trackingNumber;
}