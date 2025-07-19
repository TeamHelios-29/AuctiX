package com.helios.auctix.dtos;

import com.helios.auctix.domain.user.SellerVerificationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationRequestDTO {
    private String sellerUsername;
    private SellerVerificationStatusEnum status;
    private String docId;
    private String docType;
    private String docTitle;
    private Long docSize;
    private String description;
    private Instant createdAt;
    private Instant reviewedAt;
}
