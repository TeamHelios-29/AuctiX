package com.helios.auctix.services;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintStatus;
import com.helios.auctix.dtos.ComplaintDTO;
import com.helios.auctix.repositories.ComplaintRepository;
import com.helios.auctix.repositories.UserRepository;
//import com.helios.auctix.exceptions.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public Complaint createComplaint(@Valid ComplaintDTO complaintDto, String reportedBy) {
        // Validate users exist
//        userRepository.findByUsername(reportedBy)
//                .orElseThrow(() -> new ResourceNotFoundException("Reporting user not found"));
//        userRepository.findByUsername(complaintDto.getReportedUser())
//                .orElseThrow(() -> new ResourceNotFoundException("Reported user not found"));

        Complaint complaint = new Complaint();
        complaint.setReportId(generateReportId());
        complaint.setReportedUser(complaintDto.getReportedUser());
        complaint.setReportedBy(reportedBy);
        complaint.setReason(complaintDto.getReason());
        complaint.setDateReported(LocalDate.now());
        complaint.setStatus(ComplaintStatus.PENDING);

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

    }

    public List<Complaint> getComplaintsByUser(String username) {
        return complaintRepository.findByReportedByOrderByDateReportedDesc(username);
    }

    public Complaint updateComplaintStatus(Long id, ComplaintStatus newStatus) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(newStatus);
        return complaintRepository.save(complaint);
    }

    private String generateReportId() {
        return "CPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}