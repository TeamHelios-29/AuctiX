package com.helios.auctix.repositories;

import com.helios.auctix.domain.complaint.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByReportedByOrderByDateReportedDesc(String reportedBy);
}