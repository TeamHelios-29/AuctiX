package com.helios.auctix.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Users" )
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private UserRoleEnum role;
}
