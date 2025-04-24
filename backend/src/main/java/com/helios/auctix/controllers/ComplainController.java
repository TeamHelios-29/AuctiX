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
import java.util.UUID;

@RestController
@RequestMapping("/api/complaints")  // Changed to plural form as per REST conventions
public class ComplainController {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World";
    }

    private final ComplaintService complaintService;

    public ComplainController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintDTO complaintDto) {
        return ResponseEntity.ok(complaintService.createComplaint(complaintDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable UUID id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable UUID id,
            @RequestBody ComplaintStatus status
    ) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Complaint>> getUserComplaints(@PathVariable String username) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(username));
    }
}