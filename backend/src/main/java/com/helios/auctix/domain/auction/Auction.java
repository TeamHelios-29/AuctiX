package com.helios.auctix.domain.auction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.helios.auctix.domain.user.Seller;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String description;
    private Double startingPrice;
    private Instant startTime;
    private Instant endTime;
    private Boolean isPublic;
    private String category;

    @Column(name = "completed", nullable = false)
    private Boolean completed = false;

    @Column(name = "winning_bid_id")
    private UUID winningBidId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
    private Seller seller;

    // Use only one collection for image IDs - using ElementCollection with proper table name
    @ElementCollection
    @CollectionTable(
            name = "auction_image_paths",
            joinColumns = @JoinColumn(name = "auction_id")
    )
    @Column(name = "image_id")
    private List<UUID> imagePaths;

    // Don't use this field - it's causing database issues
    @Transient
    @JsonIgnore
    private List<UUID> imageIds;

    public UUID getSellerId() {
        return (seller != null) ? seller.getId() : null;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.completed == null) {
            this.completed = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}