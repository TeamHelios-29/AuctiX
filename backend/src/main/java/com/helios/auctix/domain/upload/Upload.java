package com.helios.auctix.domain.upload;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
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
@ToString(exclude = "owner")
public class Upload {

    @Id
    @JsonIgnore
    private UUID id;

    @Column(name="file_name", nullable = false)
    private String fileName;

    @Column(name="file_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private FileTypeEnum fileType;

    @JsonIgnore
    @Column(name="file_size", nullable = false)
    private Long fileSize; // in bytes

    @Column(name="file_id", nullable = false)
    private String fileId;

    @JsonIgnore
    @Column(name="hash_256", nullable = false)
    private String hash256;

    @JsonIgnore
    @Column(name="uploaded_at", nullable = false )
    private Timestamp uploadedAt;

    @Column(name="is_public", nullable = false)
    private Boolean isPublic;

    @Column(name="is_deleted", nullable = false)
    private Boolean isDeleted;

    @Column(name="category", nullable = false)
    private String category;

    @Column(name="owner_id")
    @JsonIgnore
    private UUID ownerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    private User owner;

    @PrePersist
    protected void onCreate() {
        log.info("onCreate called for Upload ,old uploadAt" + this.uploadedAt);
        this.id = UUID.randomUUID();
        this.isDeleted = false;
        if(this.uploadedAt == null) {
            this.uploadedAt = Timestamp.valueOf(LocalDateTime.now(ZoneOffset.UTC));
        }
        if(this.isPublic == null) {
            this.isPublic = false;
        }
    }

}
