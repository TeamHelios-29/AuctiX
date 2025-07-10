package com.helios.auctix.controllers;

import com.helios.auctix.domain.complaint.Complaint;
import com.helios.auctix.domain.complaint.ComplaintActivity;
import com.helios.auctix.domain.complaint.ComplaintStatus;
import com.helios.auctix.dtos.ComplaintActivityDTO;
import com.helios.auctix.dtos.ComplaintDTO;
import com.helios.auctix.services.ComplaintService;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
public class ComplainController {

    private final ComplaintService complaintService;

    public ComplainController(ComplaintService complaintService) {
        this.complaintService = complaintService;

    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintDTO complaintDto) throws AuthenticationException {
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



    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable UUID id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}/status")
    //@PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable UUID id,
            @RequestBody ComplaintStatus status
    ) throws AuthenticationException {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Complaint>> getUserComplaints(@PathVariable String username) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(username));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<ComplaintActivityDTO>> getComplaintTimeline(@PathVariable UUID id) {
        List<ComplaintActivity> timeline = complaintService.getComplaintTimeline(id);

        List<ComplaintActivityDTO> dtos = timeline.stream()
                .map(activity -> ComplaintActivityDTO.builder()
                        .id(activity.getId().toString())
                        .type(activity.getType())
                        .message(activity.getMessage())
                        .performedBy(activity.getPerformedBy())
                        .timestamp(activity.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ComplaintActivityDTO> addComment(
            @PathVariable UUID id,
            @RequestBody String comment
    ) throws AuthenticationException {

        ComplaintActivity activity = complaintService.addComment(id, comment);

        ComplaintActivityDTO dto = ComplaintActivityDTO.builder()
                .id(activity.getId().toString())
                .type(activity.getType())
                .message(activity.getMessage())
                .performedBy(activity.getPerformedBy())
                .timestamp(activity.getTimestamp())
                .build();

        return ResponseEntity.ok(dto);
    }


}