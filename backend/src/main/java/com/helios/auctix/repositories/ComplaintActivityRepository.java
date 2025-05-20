package com.helios.auctix.repositories;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ComplaintActivityRepository extends JpaRepository<ComplaintActivity, UUID> {
    List<ComplaintActivity> findByComplaintOrderByTimestampDesc(Complaint complaint);
}
