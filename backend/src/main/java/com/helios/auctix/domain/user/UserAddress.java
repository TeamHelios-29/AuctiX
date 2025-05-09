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
@Table(name = "User_addresses" )
public class UserAddress {
    @Id
    private UUID id;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "address_number" , length = 50)
    private String addressNumber;

    @Column(name = "address_line1", length = 255)
    private String addressLine1;

    @Column(name = "address_line2", length = 255)
    private String addressLine2;

    @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID();
    }
}
