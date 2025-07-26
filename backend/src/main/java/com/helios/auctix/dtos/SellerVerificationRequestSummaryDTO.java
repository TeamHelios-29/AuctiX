package com.helios.auctix.dtos;

import com.helios.auctix.domain.user.SellerVerificationRequest;
import com.helios.auctix.domain.user.SellerVerificationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SellerVerificationRequestSummaryDTO {
    private String sellerFirstName;
    private String sellerLastName;
    private String username;
    private String email;
    private Integer totalDocumentsSubmitted;
    private Integer pendingDocumentsCount;
    private SellerVerificationStatusEnum verificationStatus;
    private Instant submittedAt;


    public SellerVerificationRequestSummaryDTO(SellerVerificationRequest request, long totalDocumentsSubmitted, long pendingDocumentsCount){
        this.totalDocumentsSubmitted = (int) totalDocumentsSubmitted;
        this.pendingDocumentsCount = (int) pendingDocumentsCount;
        this.verificationStatus = request.getVerificationStatus();
        this.sellerFirstName = request.getSeller().getUser().getFirstName();
        this.sellerLastName = request.getSeller().getUser().getLastName();
        this.username = request.getSeller().getUser().getUsername();
        this.email = request.getSeller().getUser().getEmail();
        this.submittedAt = request.getCreatedAt();
    }
}
