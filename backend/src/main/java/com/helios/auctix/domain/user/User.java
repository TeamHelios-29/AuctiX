package com.helios.auctix.domain.user;

import com.fasterxml.jackson.annotation.*;
import com.helios.auctix.domain.upload.Upload;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Users" )
public class User {
    @Id
    @JsonIgnore
    private UUID id;

    @PrePersist
    protected void addRandUUID() {
        this.id = UUID.randomUUID();  // so it won't give an error when we try to save a user without an id
    }

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @OneToOne
    @JsonProperty("profile_photo")
    @JoinColumn(name = "profile_photo_id", nullable = true , referencedColumnName = "id")
    private Upload upload;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "role_id", nullable = false)
    private UserRole role;

    @OneToOne
    @JoinColumn(name = "id")
    private Seller seller;

    @OneToOne
    @JoinColumn(name = "id")
    private Admin admin;

    @OneToOne
    @JoinColumn(name = "id")
    private Bidder bidder;

    // helper method to make it cleaner to get the role enum
    @JsonProperty("role")
    public UserRoleEnum getRoleEnum() {
        return role.getName();
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserFCMToken> fcmTokens;

}
