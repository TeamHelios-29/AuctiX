package com.helios.auctix.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.helios.auctix.domain.upload.Upload;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "seller_verification_reqs")
public class SellerVerificationRequest {

    @Id
    @GeneratedValue
    @JsonIgnore
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private SellerVerificationStatusEnum verificationStatus;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "doc_id", nullable = true, referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    private Upload document;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "reviewed_at", nullable = false)
    private Instant reviewedAt;

    @PrePersist
    private void prePersist() {
        this.createdAt = Instant.now();
        this.reviewedAt = Instant.now();
    }
}