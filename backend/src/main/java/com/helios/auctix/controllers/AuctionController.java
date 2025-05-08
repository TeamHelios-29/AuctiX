package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.services.AuctionService;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.user.UserDetailsService;
import com.helios.auctix.services.user.UserServiceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;

import org.slf4j.LoggerFactory;
import java.time.Instant;
import java.time.format.DateTimeParseException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    private final AuctionService auctionService;
    private final Logger log = Logger.getLogger(UserController.class.getName());
    private final UserDetailsService userDetailsService;

    @Autowired
    public AuctionController(AuctionService auctionService, UserDetailsService userDetailsService) {
        this.auctionService = auctionService;
        this.userDetailsService = userDetailsService;
    }

    @Autowired
    private FileUploadService uploader;


    // Create a new auction with multipart/form-data
    @PostMapping("/create")
    public ResponseEntity<Auction> createAuction(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startingPrice") double startingPrice,
            @RequestParam("startTime") String startTime,
            @RequestParam("endTime") String endTime,
            @RequestParam("isPublic") boolean isPublic,
            @RequestParam("category") String category,
            @RequestParam("images") List<MultipartFile> images) {

        // Create an Auction object using the domain model
        try {
            //get seller id
            Authentication authentication = SecurityContextHolder
                    .getContext()
                    .getAuthentication();

            User seller = userDetailsService
                    .getAuthenticatedUser(authentication);

            UUID sellerId = seller.getId();

            // Parse dates with timezone support
            Instant startInstant = Instant.parse(startTime);
            Instant endInstant = Instant.parse(endTime);

            Auction auction = Auction.builder()
                    .title(title)
                    .description(description)
                    .startingPrice(startingPrice)
                    .startTime(startInstant)
                    .endTime(endInstant)
                    .isPublic(isPublic)
                    .category(category)
                    .sellerId(sellerId)
                    .build();


            List<String> imagePaths = images.stream()
                    .map(this::saveImage)
                    .collect(Collectors.toList());
            auction.setImagePaths(imagePaths);

            Auction createdAuction = auctionService.createAuction(auction);
            return ResponseEntity.ok(createdAuction);


        } catch (DateTimeParseException e) {
            log.warning("Invalid date format");
            return ResponseEntity.badRequest().build();
        } catch (AuthenticationException e) {
            // handle AuthenticationException gives when user is not authenticated
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.warning("Error creating auction");
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper method to save an image and return its path
    private String saveImage(MultipartFile image) {
        try {
            // Authenticate user
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            String userEmail = null;
//            if (authentication == null || authentication.getAuthorities() == null || !authentication.isAuthenticated()) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
//            }
//            userEmail = authentication.getName();
//            if (userEmail == null) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
//            }
//            log.info("File upload by user " + userEmail);


            // Upload file
            log.info("Trying to upload file");
            FileUploadResponse uploadRes = uploader.uploadFile(image, "auctionPhotos" );

            if (uploadRes.isSuccess()) {
                // save file upload data
                log.info("Trying to save file upload data");
//                UserServiceResponse res = userUploadsService.UserProfilePhotoUpdate(userEmail, uploadRes.getUpload());
                log.info("File upload data saved");

//                if (res.isSuccess()) {
//                    return ResponseEntity.ok().body("Uploaded successfully");
//                } else {
//                    log.warning(res.getMessage());
//                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload data saving failed");
//                }
                return uploadRes.getUpload().getId().toString();

            } else {
                log.warning(uploadRes.getMessage());
                throw new RuntimeException("Unsuccessful") ;
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

    // Retrieve all auctions
    @GetMapping
    public ResponseEntity<List<Auction>> getAllAuctions() {
        try {
            List<Auction> auctions = auctionService.getAllAuctions();
            return ResponseEntity.ok(auctions);
        } catch (Exception e) {
            log.warning("Error fetching all auctions: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Retrieve active auctions for displaying on the main page
    @GetMapping("/active")
    public ResponseEntity<List<Auction>> getActiveAuctions() {
        try {
            List<Auction> activeAuctions = auctionService.getActiveAuctions();
            return ResponseEntity.ok(activeAuctions);
        } catch (Exception e) {
            log.warning("Error fetching active auctions: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get auction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuctionById(@PathVariable Long id) {
        try {
            Optional<Auction> auction = auctionService.getAuctionById(id);
            return auction.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.warning("Error fetching auction by id " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
//
//    // Update an auction
//    @PutMapping("/{id}")
//    public Auction updateAuction(@PathVariable Long id, @RequestBody Auction updatedAuction) {
//        return auctionService.updateAuction(id, updatedAuction);
//    }
//
//    // Delete an auction
//    @DeleteMapping("/{id}")
//    public void deleteAuction(@PathVariable Long id) {
//        auctionService.deleteAuction(id);
//    }
//
//    // Custom endpoint: Find auctions with starting price greater than a specified value
//    @GetMapping("/priceGreaterThan")
//    public List<Auction> findAuctionsWithPriceGreaterThan(@RequestParam Double price) {
//        return auctionService.findAuctionsWithPriceGreaterThan(price);
//    }
//
//    // Custom endpoint: Find auctions within a specific time range
//    @GetMapping("/betweenDates")
//    public List<Auction> findAuctionsBetweenDates(
//            @RequestParam LocalDateTime start,
//            @RequestParam LocalDateTime end) {
//        return auctionService.findAuctionsBetweenDates(start, end);
//    }
}