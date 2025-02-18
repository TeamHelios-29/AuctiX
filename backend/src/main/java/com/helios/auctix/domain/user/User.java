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
@Table(name = "Users" )
public class User {
    @Id
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String passwordHash;

    private String firstName;
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private UserRole role;

    // helper method to make things clearer
    public UserRoleEnum getRoleEnum() {
        return role.getName();
    }

}
