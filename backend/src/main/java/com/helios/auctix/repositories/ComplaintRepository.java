package com.helios.auctix.repositories;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
    List<Complaint> findByReportedByOrderByDateReportedDesc(User reportedBy);
    Page<Complaint> findByReportedBy_UsernameContainingIgnoreCaseOrReasonContainingIgnoreCase(
            String reportedUserUsername, String reportedByUsername, String reason, Pageable pageable);
}