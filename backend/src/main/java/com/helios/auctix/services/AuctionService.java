package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.AuctionImagePath;
import com.helios.auctix.domain.user.Seller;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.SellerDTO;
import com.helios.auctix.mappers.impl.SellerMapperImpl;
import com.helios.auctix.repositories.AuctionImagePathsRepository;

import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.repositories.AuctionRepository; // Updated repository
import com.helios.auctix.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class AuctionService {

    private final AuctionRepository auctionRepository; // Updated repository
    private final AuctionImagePathsRepository auctionImagePathsRepository; // <-- Add this
    private final SellerMapperImpl sellerMapper;



    public AuctionDetailsDTO getAuctionDetails(UUID id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction == null) return null;

        List<String> imageIds = auctionImagePathsRepository.findByAuctionId(id)
                .stream()
                .map((AuctionImagePath::getImageId))
                .map(UUID::toString)
                .collect(Collectors.toList());

Seller seller = auction.getSeller();

       SellerDTO sellerDto = sellerMapper.mapTo(seller);



        return AuctionDetailsDTO.builder().seller(sellerDto).user
                .id(auction.getId().toString())
                .category(auction.getCategory())
                .title(auction.getTitle())
                .description(auction.getDescription())
                .images(imageIds) // <-- Only image IDs
                .endTime(auction.getEndTime().toString())
                .startTime(auction.getEndTime().toString())
                .build();
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

//    @Service
//    public class ImageService {
//
//        private final BlobServiceClient blobServiceClient;
//        private final String containerName;
//        private final String endpoint;
//
//        public ImageService(
//                @Value("${azure.storage.connection-string}") String connectionString,
//                @Value("${spring.cloud.azure.storage.blob.container-name}") String containerName,
//                @Value("${azure.storage.endpoint}") String endpoint) {
//
//            this.blobServiceClient = new BlobServiceClientBuilder()
//                    .connectionString(connectionString)
//                    .buildClient();
//            this.containerName = containerName;
//            this.endpoint = endpoint;
//        }
//
//        public String getImageUrl(String imageId) {
//            return String.format("%s/%s/%s", endpoint, containerName, imageId);
//        }
//
//        public List<String> getImageUrls(List<String> imageIds) {
//            return imageIds.stream()
//                    .map(this::getImageUrl)
//                    .collect(Collectors.toList());
//        }
//    }


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