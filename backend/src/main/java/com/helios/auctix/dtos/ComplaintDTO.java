package com.helios.auctix.dtos;

import com.helios.auctix.domain.complaint.ReportTargetType;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private ReportTargetType targetType;
    private UUID targetId;
    private String reason;
    private String description;
}