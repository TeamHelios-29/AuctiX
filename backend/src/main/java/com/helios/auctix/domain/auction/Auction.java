package com.helios.auctix.domain.auction;

import com.helios.auctix.domain.user.Bidder;
import com.helios.auctix.domain.user.Seller;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;
import java.time.Instant;  // You need to add this import
import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double startingPrice;
    private Instant startTime;      // For precise event timing (UTC)
    private Instant endTime;        // For precise event timing (UTC)
    private Boolean isPublic;
    private String category;
    private UUID sellerId;



    @Column(name = "created_at", updatable = false)
    private Instant createdAt;      // Changed to Instant for consistency

    @Column(name = "updated_at")
    private Instant updatedAt; // Changed to Instant for consistency

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    @PrimaryKeyJoinColumn(name = "seller_id")
    private Seller seller;


    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    @ElementCollection
    @CollectionTable(
            name = "auction_image_paths",
            joinColumns = @JoinColumn(name = "auction_id")
    )
    @Column(name = "image_paths")
    private List<String> imagePaths;

}

