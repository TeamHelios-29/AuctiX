package com.helios.auctix.domain.upload;

import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.UUID;

@Slf4j
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "uploads" )
public class Upload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="file_name", nullable = false)
    private String fileName;

    @Column(name="file_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private FileTypeEnum fileType;

    @Column(name="file_size", nullable = false)
    private Long fileSize; // in bytes

    @Column(name="url", nullable = false)
    private String url;

    @Column(name="hash_256", nullable = false)
    private String hash256;

    @Column(name="uploaded_at", nullable = false )
    private Timestamp uploadedAt;

    @Column(name="is_public", nullable = false)
    private Boolean isPublic;

    @Column(name="owner_id")
    private UUID ownerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    private User owner;

    @PrePersist
    protected void onCreate() {
        log.info("onCreate called for Upload ,old uploadAt" + this.uploadedAt);
        if(this.uploadedAt == null) {
            this.uploadedAt = Timestamp.valueOf(LocalDateTime.now(ZoneOffset.UTC));
        }
        if(this.isPublic == null) {
            this.isPublic = false;
        }
    }

}
