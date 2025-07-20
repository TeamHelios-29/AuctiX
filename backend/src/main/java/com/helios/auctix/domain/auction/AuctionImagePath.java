package com.helios.auctix.domain.auction;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "auction_image_paths")
public class AuctionImagePath {

    @EmbeddedId
    private AuctionImagePathId id;

    public AuctionImagePath() {}

    public AuctionImagePath(UUID auctionId, UUID imageId) {
        this.id = new AuctionImagePathId(auctionId, imageId);
    }

    public UUID getAuctionId() { return id.getAuctionId(); }
    public UUID getImageId() { return id.getImageId(); }

    public AuctionImagePathId getId() { return id; }
    public void setId(AuctionImagePathId id) { this.id = id; }

    // ✅ Embeddable ID class inside the entity
    @Embeddable
    public static class AuctionImagePathId implements Serializable {

        @Column(name = "auction_id")
        private UUID auctionId;

        @Column(name = "image_id")
        private UUID imageId;

        public AuctionImagePathId() {}

        public AuctionImagePathId(UUID auctionId, UUID imageId) {
            this.auctionId = auctionId;
            this.imageId = imageId;
        }

        public UUID getAuctionId() { return auctionId; }
        public void setAuctionId(UUID auctionId) { this.auctionId = auctionId; }

        public UUID getImageId() { return imageId; }
        public void setImageId(UUID imageId) { this.imageId = imageId; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof AuctionImagePathId)) return false;
            AuctionImagePathId that = (AuctionImagePathId) o;
            return Objects.equals(auctionId, that.auctionId) &&
                    Objects.equals(imageId, that.imageId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(auctionId, imageId);
        }
    }
}

