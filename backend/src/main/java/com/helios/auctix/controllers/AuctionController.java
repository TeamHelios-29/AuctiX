package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.services.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;

    @Autowired
    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
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
        Auction auction = Auction.builder()
                .title(title)
                .description(description)
                .startingPrice(startingPrice)
                .startTime(LocalDateTime.parse(startTime))
                .endTime(LocalDateTime.parse(endTime))
                .isPublic(isPublic)
                .category(category)
                .build();

        // Handle image uploads and set image paths in the Auction object
        List<String> imagePaths = images.stream()
                .map(image -> saveImage(image)) // Save each image and return its path
                .collect(Collectors.toList());
        auction.setImagePaths(imagePaths);

        // Save the auction using the service layer
        Auction createdAuction = auctionService.createAuction(auction);
        return ResponseEntity.ok(createdAuction);
    }

    // Helper method to save an image and return its path
    private String saveImage(MultipartFile image) {
        try {
            String fileName = image.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);
            Files.write(path, image.getBytes());
            return path.toString();
        } catch (IOException e) {
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