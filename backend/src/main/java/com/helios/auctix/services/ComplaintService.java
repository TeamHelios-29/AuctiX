package com.helios.auctix.services;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintStatus;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.ComplaintDTO;
import com.helios.auctix.repositories.ComplaintRepository;
import com.helios.auctix.repositories.UserRepository;
//import com.helios.auctix.exceptions.ResourceNotFoundException;
import com.helios.auctix.services.user.UserDetailsService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
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
        User reportedUser = userRepository.findById(complaintDto.getReportedUserId())
                .orElseThrow(() -> new RuntimeException("Reported user not found"));
        User reportingUser = userRepository.findById(complaintDto.getReportingUserId())
                .orElseThrow(() -> new RuntimeException("Reporting user not found"));

        Complaint complaint = new Complaint();
        complaint.setReportedUser(reportedUser);
        complaint.setReportedBy(reportingUser);
        complaint.setReason(complaintDto.getReason());
        complaint.setDateReported(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.PENDING);

        return complaintRepository.save(complaint);
    }

    public Page<Complaint> getAllComplaints(Integer limit, Integer offset, String sortBy, String order, String search) {
        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(offset, limit, Sort.by(direction, sortBy));

        log.info("limit: {}, offset: {}, sortBy: {}, order: {}, search: {}", limit, offset, sortBy, order, search);
        if (search != null && !search.trim().isEmpty()) {
            log.info("search: {}", search);
            return complaintRepository.findByReportedUser_UsernameContainingIgnoreCaseOrReportedBy_UsernameContainingIgnoreCaseOrReasonContainingIgnoreCase(search,search,search, pageable);
        } else {
            return complaintRepository.findAll(pageable);
        }
    }

    public Complaint getComplaintById(UUID id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
    }

    public List<Complaint> getComplaintsByUser(String username) {
        UserDetailsService userDetailsService = new UserDetailsService();
        User user = userDetailsService.getUserByUsername(username);
        if(user == null) {
            new RuntimeException("User not found");
        }
        return complaintRepository.findByReportedByOrderByDateReportedDesc(user);
    }

    public Complaint updateComplaintStatus(UUID id, ComplaintStatus newStatus) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(newStatus);
        return complaintRepository.save(complaint);
    }
}