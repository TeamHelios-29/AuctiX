package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.Admin;
import com.helios.auctix.domain.user.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}
