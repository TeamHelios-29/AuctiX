package com.helios.auctix.controllers;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintStatus;
import com.helios.auctix.dtos.ComplaintDTO;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")  // Changed to plural form as per REST conventions
public class ComplainController {

    private final ComplaintService complaintService;

    public ComplainController(ComplaintService complaintService, UserRepository userRepository) {
        this.complaintService = complaintService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World";
    }

    @PostMapping("/createReport")
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintDTO complaintDto,
                                                     Principal principal) {
        return ResponseEntity.ok(complaintService.createComplaint(complaintDto, principal.getName()));
    }

    @GetMapping("/allReports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id,
                                                           @RequestBody ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Complaint>> getUserComplaints(Principal principal) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(principal.getName()));
    }
}