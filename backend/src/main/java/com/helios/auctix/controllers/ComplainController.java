package com.helios.auctix.controllers;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintStatus;
import com.helios.auctix.dtos.ComplaintDTO;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.ComplaintService;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<?> getAllComplaints(
        @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
        @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset,
        @RequestParam(value = "sortby", required = false, defaultValue = "id") String sortBy,
        @RequestParam(value = "order", required = false, defaultValue = "asc") String order,
        @RequestParam(value = "search", required = false) String search) {

            try{
                Page complaintPage = complaintService.getAllComplaints(limit,offset,sortBy,order,search);
                return ResponseEntity.ok(complaintPage);
            }
            catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        //return ResponseEntity.ok(complaintService.getAllComplaints());


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