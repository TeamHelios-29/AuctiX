package com.helios.auctix.domain.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bidders" )
public class Bidder {

    @Id
    private UUID id;

    @Column(name="is_active", nullable = false)
    private boolean isActive;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;


}
