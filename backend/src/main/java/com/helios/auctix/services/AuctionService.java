package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.repositories.AuctionRepository; // Updated repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {

    private final AuctionRepository auctionRepository; // Updated repository

    @Autowired
    public AuctionService(AuctionRepository auctionRepository) { // Updated repository
        this.auctionRepository = auctionRepository;
    }

    public Auction createAuction(Auction auction) {
        // Validate required fields
        if (auction.getTitle() == null || auction.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (auction.getStartingPrice() <= 0) {
            throw new IllegalArgumentException("Starting price must be greater than 0");
        }
        if (auction.getStartTime().isAfter(auction.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Set timestamps
        auction.setCreatedAt(Instant.now());
        auction.setUpdatedAt(Instant.now());

        return auctionRepository.save(auction);


//        try {
//            // Validate and save the auction
//            return auctionRepository.save(auction);
//        } catch (DataIntegrityViolationException e) {
//            throw new RuntimeException("Failed to create auction: Duplicate entry or invalid data");
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to create auction: " + e.getMessage());
//        }
    }

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public Optional<Auction> getAuctionById(Long id) {
        return auctionRepository.findById(id);
    }

    // Add methods for fetching active auctions
    public List<Auction> getActiveAuctions() {
        Instant now = Instant.now();
        return auctionRepository.findByStartTimeBeforeAndEndTimeAfterAndIsPublicTrue(now, now);
    }

//    public Auction createAuction(Auction auction, List<MultipartFile> images) {
//        // Validate and save images
//        if (images != null && !images.isEmpty()) {
//            List<String> imagePaths = images.stream()
//                    .map(this::saveImage)
//                    .collect(Collectors.toList());
//            auction.setImagePaths(imagePaths);
//        }
//
//        // Save the auction
//        return createAuction(auction);
//    }
//
//    private String saveImage(MultipartFile image) {
//        try {
//            String fileName = image.getOriginalFilename();
//            Path path = Paths.get("uploads/" + fileName);
//            Files.write(path, image.getBytes());
//            return path.toString();
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to save image: " + e.getMessage());
//        }
//    }


//    // Retrieve all bids
//    public List<Auction> getAllBids() {
//        return bidRepository.findAll();
//    }
//
//    // Retrieve a bid by ID
//    public Optional<Auction> getBidById(Long id) {
//        return bidRepository.findById(id);
//    }
//
//    // Update a bid
//    public Auction updateBid(Long id, Auction updatedAuction) {
//        return bidRepository.findById(id)
//                .map(auction -> {
//                    auction.setAmount(updatedAuction.getAmount());
//                    auction.setBidTime(updatedAuction.getBidTime());
//                    auction.setUpdatedAt(LocalDateTime.now());
//                    return bidRepository.save(auction);
//                })
//                .orElseThrow(() -> new RuntimeException("Bid not found with id: " + id));
//    }
//
//    // Delete a bid
//    public void deleteBid(Long id) {
//        bidRepository.deleteById(id);
//    }
//
//    // Custom business logic: Find bids with amount greater than a specified value
//    public List<Auction> findBidsWithAmountGreaterThan(Double amount) {
//        return bidRepository.findByAmountGreaterThan(amount);
//    }
//
//    // Custom business logic: Find bids within a specific time range
//    public List<Auction> findBidsBetweenDates(LocalDateTime start, LocalDateTime end) {
//        return bidRepository.findByBidTimeBetween(start, end);
//    }
}