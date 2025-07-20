package com.helios.auctix.domain.watchlist;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auction_watch_list", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "auction_id"})
})
@ToString(exclude = {"user", "auction"})
public class AuctionWatchList {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auction_id", referencedColumnName = "id", nullable = false)
    private Auction auction;

    @Column(name = "watched_at", nullable = false)
    private LocalDateTime watchedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.watchedAt == null) {
            this.watchedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}