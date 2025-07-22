package com.helios.auctix.controllers;

import com.azure.core.util.BinaryData;
import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.*;
import com.helios.auctix.services.AuctionService;
import com.helios.auctix.services.BidService;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.fileUpload.FileUploadUseCaseEnum;
import com.helios.auctix.services.user.UserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    private final AuctionService auctionService;
    private final BidService bidService;
    private final Logger log = Logger.getLogger(AuctionController.class.getName());
    private final UserDetailsService userDetailsService;
    private static final int SELLER_ROLE_ID = 4;

    @Autowired
    private FileUploadService uploader;

    // First, create an ErrorResponse class for consistent error responses
    public class ErrorResponse {
        private String message;
        private String error;
        private int status;
        private long timestamp;

        public ErrorResponse(String message, String error, int status) {
            this.message = message;
            this.error = error;
            this.status = status;
            this.timestamp = System.currentTimeMillis();
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }

        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }

        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }

    // Create a new auction with multipart/form-data
    @PostMapping("/create")
    public ResponseEntity<?> createAuction(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startingPrice") double startingPrice,
            @RequestParam("startTime") String startTime,
            @RequestParam("endTime") String endTime,
            @RequestParam("isPublic") boolean isPublic,
            @RequestParam("category") String category,
            @RequestParam("images") List<MultipartFile> images) {

        log.info("Received createAuction request");

        // Create an Auction object using the domain model
        try {
            //get seller id
            Authentication authentication = SecurityContextHolder
                    .getContext()
                    .getAuthentication();

            User seller = userDetailsService
                    .getAuthenticatedUser(authentication);

            // Check if user is a seller
            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "Access denied. Only sellers can create auctions.",
                        "FORBIDDEN",
                        HttpStatus.FORBIDDEN.value()
                );
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(errorResponse);
            }

            // Validate images
            if (images == null || images.isEmpty()) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "At least one image is required.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            if (images.size() > 5) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "Maximum 5 images are allowed.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            // Validate image files
            for (MultipartFile image : images) {
                if (image.getSize() > 5 * 1024 * 1024) { // 5MB limit
                    ErrorResponse errorResponse = new ErrorResponse(
                            "Each image must be less than 5MB.",
                            "VALIDATION_ERROR",
                            HttpStatus.BAD_REQUEST.value()
                    );
                    return ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body(errorResponse);
                }

                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    ErrorResponse errorResponse = new ErrorResponse(
                            "Only image files are allowed.",
                            "VALIDATION_ERROR",
                            HttpStatus.BAD_REQUEST.value()
                    );
                    return ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body(errorResponse);
                }
            }

            // Parse and validate dates
            Instant startInstant;
            Instant endInstant;

            try {
                startInstant = Instant.parse(startTime);
                endInstant = Instant.parse(endTime);
            } catch (DateTimeParseException e) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "Invalid date format. Please use ISO 8601 format.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            // Additional date validations
            Instant now = Instant.now();
            if (startInstant.isBefore(now)) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "Start time must be in the future.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            if (endInstant.isBefore(startInstant)) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "End time must be after start time.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            long durationHours = java.time.Duration.between(startInstant, endInstant).toHours();
            if (durationHours < 1) {
                ErrorResponse errorResponse = new ErrorResponse(
                        "Auction must run for at least 1 hour.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            if (durationHours > 30 * 24) { // 30 days
                ErrorResponse errorResponse = new ErrorResponse(
                        "Auction cannot run for more than 30 days.",
                        "VALIDATION_ERROR",
                        HttpStatus.BAD_REQUEST.value()
                );
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(errorResponse);
            }

            Auction auction = Auction.builder()
                    .title(title)
                    .description(description)
                    .startingPrice(startingPrice)
                    .startTime(startInstant)
                    .endTime(endInstant)
                    .isPublic(isPublic)
                    .category(category)
                    .seller(seller.getSeller())
                    .build();

            // Save images
            List<UUID> imagePaths;
            try {
                imagePaths = images.stream()
                        .map(this::saveImage)
                        .collect(Collectors.toList());
                auction.setImagePaths(imagePaths);
            } catch (Exception e) {
                log.severe("Error saving images: " + e.getMessage());
                ErrorResponse errorResponse = new ErrorResponse(
                        "Failed to save images. Please try again.",
                        "IMAGE_SAVE_ERROR",
                        HttpStatus.INTERNAL_SERVER_ERROR.value()
                );
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(errorResponse);
            }

            Auction createdAuction = auctionService.createAuction(auction);

            log.info("Auction created successfully with ID: " + createdAuction.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAuction);

        } catch (AuthenticationException e) {
            log.warning("Authentication failed: " + e.getMessage());
            ErrorResponse errorResponse = new ErrorResponse(
                    "Authentication failed. Please log in again.",
                    "AUTHENTICATION_ERROR",
                    HttpStatus.UNAUTHORIZED.value()
            );
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse);

        } catch (IllegalArgumentException e) {
            log.warning("Validation error: " + e.getMessage());
            ErrorResponse errorResponse = new ErrorResponse(
                    e.getMessage(),
                    "VALIDATION_ERROR",
                    HttpStatus.BAD_REQUEST.value()
            );
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);

        } catch (Exception e) {
            log.severe("Unexpected error creating auction: " + e.getMessage());
            e.printStackTrace(); // For debugging
            ErrorResponse errorResponse = new ErrorResponse(
                    "An unexpected error occurred. Please try again later.",
                    "INTERNAL_SERVER_ERROR",
                    HttpStatus.INTERNAL_SERVER_ERROR.value()
            );
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    // Helper method to save an image and return its path
    private UUID saveImage(MultipartFile image) {
        try {
            // Upload file
            log.info("Trying to upload file");
            FileUploadResponse uploadRes = uploader.uploadFile(image, FileUploadUseCaseEnum.AUCTION_IMAGE);

            if (uploadRes.isSuccess()) {
                // save file upload data
                log.info("File upload data saved");

                return uploadRes.getUpload().getId();

            } else {
                log.warning(uploadRes.getMessage());
                throw new RuntimeException("Unsuccessful") ;
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }


    @GetMapping("/getAuctionImages")
    public ResponseEntity<?> getAuctionImages(@RequestParam("file_uuid") UUID file_uuid) {
        FileUploadResponse res;
        log.info("file get request: "+ file_uuid);

        if(!uploader.isFilePublic(file_uuid)) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Get file upload data
            res = uploader.getFile(file_uuid);
        }
        else{
            res = uploader.getFile(file_uuid);
        }

        if (!res.isSuccess()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res.getMessage());
        }

        BinaryData binaryFile = res.getBinaryData();
        String fileName = res.getUpload().getFileName();
        String contentType = res.getUpload().getFileType().getContentType();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(binaryFile.toBytes());
    }

    // Get auction by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuctionDetailsDTO> getAuctionById(@PathVariable UUID id) {
        try {
            AuctionDetailsDTO dto = auctionService.getAuctionDetails(id);
            if (dto == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.warning("Error fetching auction by id " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get current server time for client synchronization
     * @return Current server timestamp in milliseconds
     */
    @GetMapping("/server-time")
    public ResponseEntity<Map<String, Long>> getServerTime() {
        try {
            Map<String, Long> response = new HashMap<>();
            response.put("timestamp", Instant.now().toEpochMilli());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warning("Error getting server time: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Add this method to your existing AuctionController class

    @GetMapping("/all")
    public ResponseEntity<List<AuctionDetailsDTO>> getAllAuctions(
            @RequestParam(value = "filter", defaultValue = "active") String filter) {
        try {
            List<AuctionDetailsDTO> auctions;

            switch (filter.toLowerCase()) {
                case "active":
                    auctions = auctionService.getActiveAuctionsDTO();
                    break;
                case "expired":
                    auctions = auctionService.getExpiredAuctionsDTO();
                    break;
                case "upcoming":  // Add new case for upcoming
                    auctions = auctionService.getUpcomingAuctionsDTO();
                    break;
                default:
                    auctions = auctionService.getAllAuctionsDTO();
                    break;
            }

            return ResponseEntity.ok(auctions);
        } catch (Exception e) {
            log.warning("Error fetching auctions with filter " + filter + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Add these new endpoints to your existing AuctionController

    /**
     * Get all auctions for the authenticated seller with filtering
     * @param filter - total, ongoing/active, upcoming, completed/ended, unlisted, deleted
     * @param searchTerm - optional search term for title or ID
     * @return List of seller's auctions
     */
    @GetMapping("/seller/auctions")
    public ResponseEntity<List<SellerAuctionDTO>> getSellerAuctions(
            @RequestParam(value = "filter", defaultValue = "total") String filter,
            @RequestParam(value = "search", required = false) String searchTerm) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User seller = userDetailsService.getAuthenticatedUser(authentication);

            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            // Map frontend filter names to backend filter names
            String mappedFilter = mapFrontendFilterToBackend(filter);

            List<SellerAuctionDTO> auctions = auctionService.getSellerAuctions(
                    seller.getSeller().getId(), mappedFilter, searchTerm);

            return ResponseEntity.ok(auctions);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warning("Error fetching seller auctions: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Map frontend filter names to backend filter names
     */
    private String mapFrontendFilterToBackend(String frontendFilter) {
        switch (frontendFilter.toLowerCase()) {
            case "active":
                return "ongoing";
            case "ended":
                return "completed";
            default:
                return frontendFilter;
        }
    }

    /**
     * Get auction statistics for the authenticated seller
     * @return Statistics object with counts
     */
    @GetMapping("/seller/stats")
    public ResponseEntity<SellerAuctionStatsDTO> getSellerAuctionStats() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User seller = userDetailsService.getAuthenticatedUser(authentication);

            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            SellerAuctionStatsDTO stats = auctionService.getSellerAuctionStats(seller.getSeller().getId());
            return ResponseEntity.ok(stats);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warning("Error fetching seller auction stats: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAuction(
            @PathVariable UUID id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startingPrice") double startingPrice,
            @RequestParam("startTime") String startTime,
            @RequestParam("endTime") String endTime,
            @RequestParam("isPublic") boolean isPublic,
            @RequestParam("category") String category,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User seller = userDetailsService.getAuthenticatedUser(authentication);

            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only sellers can update auctions");
            }

            // Check if auction exists and belongs to seller
            Auction existingAuction = auctionService.getAuctionById(id);
            if (existingAuction == null) {
                return ResponseEntity.notFound().build();
            }

            if (!existingAuction.getSeller().getId().equals(seller.getSeller().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own auctions");
            }

            // Check if auction has bids
            boolean hasBids = bidService.hasAuctionReceivedBids(id);

            AuctionUpdateRequestDTO updateRequest = AuctionUpdateRequestDTO.builder()
                    .title(title)
                    .description(description)
                    .startingPrice(startingPrice)
                    .startTime(startTime)
                    .endTime(endTime)
                    .isPublic(isPublic)
                    .category(category)
                    .images(images)
                    .build();

            Auction updatedAuction = auctionService.updateAuction(id, updateRequest, hasBids);
            return ResponseEntity.ok(updatedAuction);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warning("Error updating auction: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete an auction (with restrictions based on bid status)
     * @param id Auction ID
     * @return Response message
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAuction(@PathVariable UUID id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User seller = userDetailsService.getAuthenticatedUser(authentication);

            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only sellers can delete auctions");
            }

            // Check if auction exists and belongs to seller
            Auction existingAuction = auctionService.getAuctionById(id);
            if (existingAuction == null) {
                return ResponseEntity.notFound().build();
            }

            if (!existingAuction.getSeller().getId().equals(seller.getSeller().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own auctions");
            }

            // Check if auction has bids
            boolean hasBids = bidService.hasAuctionReceivedBids(id);

            String result = auctionService.deleteAuction(id, hasBids);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            log.warning("Invalid request parameters: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid request parameters.");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warning("Error deleting auction: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get auction data for update form
     * @param id Auction ID
     * @return Auction data for form
     */
    @GetMapping("/update/{id}")
    public ResponseEntity<AuctionUpdateFormDTO> getAuctionForUpdate(@PathVariable UUID id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User seller = userDetailsService.getAuthenticatedUser(authentication);

            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            AuctionUpdateFormDTO formData = auctionService.getAuctionForUpdate(id, seller.getSeller().getId());
            if (formData == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(formData);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warning("Error fetching auction for update: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


}