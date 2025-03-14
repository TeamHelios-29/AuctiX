package com.helios.auctix.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "user_profile_photos" )
public class UserProfilePhoto {

    @Id
    private UUID id;

    @Column(name="photo_ref", nullable = false)
    private boolean photoRef;


}
