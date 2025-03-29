package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.services.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Instant;
import java.time.format.DateTimeParseException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    private static final Logger logger = LoggerFactory.getLogger(AuctionController.class);
    private final AuctionService auctionService;

    @Autowired
    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }


    @PostMapping("/")
    public String hello() {
        return "hello";
    }
    // Create a new auction with multipart/form-data
    @PostMapping(consumes = "multipart/form-data")
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
                    .build();

            List<String> imagePaths = images.stream()
                    .map(this::saveImage)
                    .collect(Collectors.toList());
            auction.setImagePaths(imagePaths);

            Auction createdAuction = auctionService.createAuction(auction);
            return ResponseEntity.ok(createdAuction);
        } catch (DateTimeParseException e) {
            logger.error("Invalid date format", e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating auction", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper method to save an image and return its path
    private String saveImage(MultipartFile image) {
        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Sanitize filename (replace spaces and special characters)
            String originalFilename = image.getOriginalFilename();
            String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");

            // Save the file
            Path path = uploadPath.resolve(sanitizedFilename);
            Files.write(path, image.getBytes());

            return path.toString();
        } catch (IOException e) {
            logger.error("Failed to save image: {}", image.getOriginalFilename(), e);
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

//    // Retrieve all auctions
//    @GetMapping
//    public List<Auction> getAllAuctions() {
//        return auctionService.getAllAuctions();
//    }
//
//    // Retrieve an auction by ID
//    @GetMapping("/{id}")
//    public Optional<Auction> getAuctionById(@PathVariable Long id) {
//        return auctionService.getAuctionById(id);
//    }
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