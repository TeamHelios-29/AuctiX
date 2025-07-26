package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.SellerVerificationRequest;
import com.helios.auctix.domain.user.SellerVerificationStatusEnum;
import com.helios.auctix.domain.user.UserRole;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.dtos.SellerVerificationRequestSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface SellerVerificationRequestRepository extends JpaRepository<SellerVerificationRequest, UUID> {

    List<SellerVerificationRequest> findAllBySellerId(UUID id);

    @Query("""
    SELECT new com.helios.auctix.dtos.SellerVerificationRequestSummaryDTO(
        r,
        (SELECT COUNT(r2) FROM SellerVerificationRequest r2 WHERE r2.seller.id = r.seller.id),
        (SELECT COUNT(r3) FROM SellerVerificationRequest r3 
         WHERE r3.seller.id = r.seller.id 
         AND r3.verificationStatus = com.helios.auctix.domain.user.SellerVerificationStatusEnum.PENDING
         AND r3.createdAt <= r.createdAt)
    )
    FROM SellerVerificationRequest r
    JOIN r.seller s
    JOIN s.user u
    WHERE
        (:search IS NULL OR 
         LOWER(u.firstName) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%')) OR 
         LOWER(u.lastName) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%')) OR 
         LOWER(u.email) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%')))
    AND (:statusFilter IS NULL OR r.verificationStatus = :statusFilter)
""")
    Page<SellerVerificationRequestSummaryDTO> searchAndFilter(
            @Param("search") String search,
            @Param("statusFilter") SellerVerificationStatusEnum statusFilter,
            Pageable pageable
    );
}