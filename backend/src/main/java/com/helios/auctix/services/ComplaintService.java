package com.helios.auctix.services;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintStatus;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.ComplaintDTO;
import com.helios.auctix.repositories.ComplaintRepository;
import com.helios.auctix.repositories.UserRepository;
//import com.helios.auctix.exceptions.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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

    public Complaint createComplaint(@Valid ComplaintDTO complaintDto) {
        User reportedUser = userRepository.findByUsername(complaintDto.getReportedUserUsername())
                .orElseThrow(() -> new RuntimeException("Reported user not found"));
        User reportingUser = userRepository.findByUsername(complaintDto.getReportingUserUsername())
                .orElseThrow(() -> new RuntimeException("Reporting user not found"));

        Complaint complaint = new Complaint();
        complaint.setReportedUser(reportedUser);
        complaint.setReportedBy(reportingUser);
        complaint.setReason(complaintDto.getReason());
        complaint.setDateReported(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.PENDING);

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(UUID id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
    }

    public List<Complaint> getComplaintsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByReportedByOrderByDateReportedDesc(user);
    }

    public Complaint updateComplaintStatus(UUID id, ComplaintStatus newStatus) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(newStatus);
        return complaintRepository.save(complaint);
    }
}