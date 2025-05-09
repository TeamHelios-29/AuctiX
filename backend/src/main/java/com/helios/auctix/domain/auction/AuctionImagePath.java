package com.helios.auctix.domain.auction;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "auction_image_paths")
public class AuctionImagePath {

    @Id
    @Column(name = "auction_id", nullable = false)
    private UUID auctionId;

    @Column(name = "image_paths", nullable = false)
    private String imageId;

    // getters and setters

    public UUID getAuctionId() { return auctionId; }
    public void setAuctionId(UUID auctionId) { this.auctionId = auctionId; }

    public String getImageId() { return imageId; }
    public void setImageId(String imageId) { this.imageId = imageId; }
}
