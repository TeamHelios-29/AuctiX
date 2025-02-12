package com.helios.auctix.domain.user;

import com.helios.auctix.domain.UserRoleEnum;
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
    private String username;
    private String email;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private UserRoleEnum role;
}