package com.helios.auctix.controllers;

import com.azure.core.util.BinaryData;
import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.user.Seller;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.services.AuctionService;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.user.UserDetailsService;
import com.helios.auctix.services.user.UserServiceResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

@AllArgsConstructor
@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    private final AuctionService auctionService;
    private final Logger log = Logger.getLogger(AuctionController.class.getName());
    private final UserDetailsService userDetailsService;
    private static final int SELLER_ROLE_ID = 4;

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

        log.info("Received createAuction request");

        // Create an Auction object using the domain model
        try {
            //get seller id
            Authentication authentication = SecurityContextHolder
                    .getContext()
                    .getAuthentication();

            User seller = userDetailsService
                    .getAuthenticatedUser(authentication);

            if (seller.getRole().getId() != SELLER_ROLE_ID) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN) //returning 403 status code if user isn't a seller
                        .body(null);
            }

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
                    .seller(seller.getSeller())
                    .build();

            List<UUID> imagePaths = images.stream()
                    .map(this::saveImage)
                    .collect(Collectors.toList());
            auction.setImagePaths(imagePaths);

            Auction createdAuction = auctionService.createAuction(auction);

            log.info("Auction created successfully with ID: " + createdAuction.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAuction);

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
    private UUID saveImage(MultipartFile image) {
        try {
            // Upload file
            log.info("Trying to upload file");
            FileUploadResponse uploadRes = uploader.uploadFile(image, "auctionPhotos" );

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

}