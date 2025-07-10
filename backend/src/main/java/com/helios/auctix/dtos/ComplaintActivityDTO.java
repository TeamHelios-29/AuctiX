package com.helios.auctix.dtos;

import com.helios.auctix.domain.complaint.ActivityType;
import jdk.jshell.Snippet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintActivityDTO {
    private String id;
    private ActivityType type;
    private String message;
    private String performedBy;
    private LocalDateTime timestamp;


}
