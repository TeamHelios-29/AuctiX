package com.helios.auctix.dtos;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private UUID reportedUserId;
    private UUID reportingUserId;
    private String reason;
}