package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.UserRole;
import com.helios.auctix.domain.user.UserRoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByName(UserRoleEnum name);
    boolean existsByName(UserRoleEnum name);
}
