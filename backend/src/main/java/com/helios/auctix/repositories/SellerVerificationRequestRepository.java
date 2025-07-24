package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.SellerVerificationRequest;
import com.helios.auctix.domain.user.UserRole;
import com.helios.auctix.domain.user.UserRoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SellerVerificationRequestRepository extends JpaRepository<SellerVerificationRequest, UUID> {

    List<SellerVerificationRequest> findAllBySellerId(UUID id);
}
