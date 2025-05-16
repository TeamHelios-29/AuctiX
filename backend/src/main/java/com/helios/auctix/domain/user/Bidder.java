package com.helios.auctix.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bidders" )
@ToString(exclude = "user") // or else we get cyclic dependency
public class Bidder {

    @Id
    @JsonIgnore
    private UUID id;

    @Column(name="is_active", nullable = false)
    private boolean isActive;

    @OneToOne
    @MapsId
    @JsonIgnore
    @JoinColumn(name = "id")
    private User user;


}
