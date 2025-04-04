package com.helios.auctix.dtos;

import com.helios.auctix.domain.user.User;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private String reportedUserUsername;
    private String reportingUserUsername;
    private String reason;
}