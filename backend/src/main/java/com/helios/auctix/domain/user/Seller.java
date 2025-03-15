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
@Table(name = "sellers" )
public class Seller {

    @Id
    private UUID id;

    @Column(name="is_verified",nullable = false)
    private boolean isVerified;

    @Column(name="is_active" , nullable = false)
    private boolean isActive;

    @Column(name="banner_id", nullable = true)
    private Integer bannerId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id", nullable = false)
    private User user;


}
