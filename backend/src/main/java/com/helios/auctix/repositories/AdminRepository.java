package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.Admin;
import com.helios.auctix.domain.user.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}
