package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.AuctionImagePath;
import com.helios.auctix.domain.chat.ChatRoom;
import com.helios.auctix.dtos.*;
import com.helios.auctix.mappers.impl.SellerMapperImpl;
import com.helios.auctix.mappers.impl.UserMapperImpl;
import com.helios.auctix.repositories.AuctionImagePathsRepository;

import com.helios.auctix.repositories.AuctionRepository;

import com.helios.auctix.repositories.chat.ChatRoomRepository;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.fileUpload.FileUploadUseCaseEnum;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@AllArgsConstructor
@Service
public class AuctionService {

    private final AuctionRepository auctionRepository; // Updated repository
    private final AuctionImagePathsRepository auctionImagePathsRepository; // <-- Add this
    private final SellerMapperImpl sellerMapper;
    private final UserMapperImpl userMapperImpl;
    private final BidService bidService;
    private final ChatRoomRepository chatRoomRepository;
    @Autowired
    private FileUploadService uploader;

    public AuctionDetailsDTO getAuctionDetails(UUID id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction == null) return null;

        List<String> imageIds = auctionImagePathsRepository.findById_AuctionId(id)
                .stream()
                .map(AuctionImagePath::getImageId)
                .map(UUID::toString)
                .collect(Collectors.toList());

       UserDTO sellerDto = userMapperImpl.mapTo(auction.getSeller().getUser());

        // Fetch bid history and highest bid
        List<BidDTO> bidHistory = bidService.getBidHistoryForAuction(id)
                .stream()
                .map(bidService::convertToDTO)
                .toList();

        BidDTO highestBid = bidService.getHighestBidForAuction(id)
                .map(bidService::convertToDTO)
                .orElse(null);


        return AuctionDetailsDTO.builder().seller(sellerDto)
                .id(auction.getId().toString())
                .category(auction.getCategory())
                .title(auction.getTitle())
                .description(auction.getDescription())
                .images(imageIds) // <-- Only image IDs
                .endTime(auction.getEndTime().toString())
                .startTime(auction.getEndTime().toString())
                .bidHistory(bidHistory)
                .currentHighestBid(highestBid)
                .startingPrice(auction.getStartingPrice())
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

        Auction savedAuction = auctionRepository.save(auction);

        // create a chat-room for the auction and add join the seller to the chat
        createChatRoomForAuction(savedAuction);
        return savedAuction;
    }

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAllPublicAuctions(); // Use the new method
    }

    // Get currently running auctions (started and not ended)
    public List<Auction> getActiveAuctions() {
        Instant now = Instant.now();
        return auctionRepository.findActiveAuctions(now);
    }

    // Get available auctions (not yet ended - includes future auctions)
    public List<Auction> getAvailableAuctions() {
        Instant now = Instant.now();
        return auctionRepository.findAvailableAuctions(now);
    }

    // Get upcoming auctions (future auctions)
    public List<Auction> getUpcomingAuctions() {
        Instant now = Instant.now();
        return auctionRepository.findUpcomingAuctions(now);
    }

    // Get expired auctions from the last 3 days
    public List<Auction> getExpiredAuctions() {
        Instant now = Instant.now();
        Instant threeDaysAgo = now.minus(3, ChronoUnit.DAYS);
        return auctionRepository.findExpiredAuctions(now, threeDaysAgo);
    }


    public List<AuctionDetailsDTO> getActiveAuctionsDTO() {
        // Only return auctions that have started but not ended
        return getActiveAuctions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AuctionDetailsDTO> getUpcomingAuctionsDTO() {
        // Only return auctions that haven't started yet
        return getUpcomingAuctions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AuctionDetailsDTO> getExpiredAuctionsDTO() {
        // Only return auctions that have ended
        return getExpiredAuctions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all auctions as DTOs for the frontend
    public List<AuctionDetailsDTO> getAllAuctionsDTO() {
        return getAllAuctions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert Auction entity to AuctionDetailsDTO (package private so other services can use)
    AuctionDetailsDTO convertToDTO(Auction auction) {
        List<String> imageIds = auctionImagePathsRepository.findById_AuctionId(auction.getId())
                .stream()
                .map(AuctionImagePath::getImageId)
                .map(UUID::toString)
                .collect(Collectors.toList());

        UserDTO sellerDto = userMapperImpl.mapTo(auction.getSeller().getUser());

        // For list view, we don't need full bid history, just the highest bid
        BidDTO highestBid = bidService.getHighestBidForAuction(auction.getId())
                .map(bidService::convertToDTO)
                .orElse(null);

        return AuctionDetailsDTO.builder()
                .seller(sellerDto)
                .id(auction.getId().toString())
                .category(auction.getCategory())
                .title(auction.getTitle())
                .description(auction.getDescription())
                .images(imageIds)
                .endTime(auction.getEndTime().toString())
                .startTime(auction.getStartTime().toString())
//                .bidHistory(null) // Don't load full history for list view
//                .currentHighestBid(highestBid)
                .startingPrice(auction.getStartingPrice())
                .build();
    }


    private void createChatRoomForAuction(Auction auction) {
        ChatRoom chatRoom = ChatRoom.builder()
                .auction(auction)
                .build();

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        if (auction.getSeller() != null) {
            chatRoomRepository.addUserToChatRoom(savedChatRoom.getId(), auction.getSeller().getId());
        }
    }

    // Add these new methods to your existing AuctionService

    /**
     * Get all auctions for a specific seller with filtering
     */
    public List<SellerAuctionDTO> getSellerAuctions(UUID sellerId, String filter, String searchTerm) {
        List<Auction> auctions = auctionRepository.findBySellerId(sellerId);

        // Apply filter
        auctions = filterAuctionsByStatus(auctions, filter);

        // Apply search if provided
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            auctions = auctions.stream()
                    .filter(auction ->
                            auction.getTitle().toLowerCase().contains(searchTerm.toLowerCase()) ||
                                    auction.getId().toString().toLowerCase().contains(searchTerm.toLowerCase())
                    )
                    .collect(Collectors.toList());
        }

        return auctions.stream()
                .map(this::convertToSellerAuctionDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get auction statistics for a seller - Updated to match new filter logic
     */
    public SellerAuctionStatsDTO getSellerAuctionStats(UUID sellerId) {
        List<Auction> allAuctions = auctionRepository.findBySellerId(sellerId);
        Instant now = Instant.now();

        // Calculate stats using the same logic as filtering
        int totalAuctions = (int) allAuctions.stream()
                .filter(a -> !a.isDeleted())
                .count();

        int activeAuctions = (int) allAuctions.stream()
                .filter(a -> a.getStartTime().isBefore(now) &&
                        a.getEndTime().isAfter(now) &&
                        a.isPublic() &&
                        !a.isDeleted())
                .count();

        int upcomingAuctions = (int) allAuctions.stream()
                .filter(a -> a.getStartTime().isAfter(now) &&
                        a.isPublic() &&
                        !a.isDeleted())
                .count();

        int endedAuctions = (int) allAuctions.stream()
                .filter(a -> a.getEndTime().isBefore(now) &&
                        !a.isDeleted())
                .count();

        int unlistedAuctions = (int) allAuctions.stream()
                .filter(a -> (!a.isPublic() && !a.isDeleted()) ||
                        (a.isDeleted() && "PENDING_ADMIN_APPROVAL".equals(a.getDeletionStatus())))
                .count();

        int deletedAuctions = (int) allAuctions.stream()
                .filter(Auction::isDeleted)
                .count();

        return SellerAuctionStatsDTO.builder()
                .totalAuctions(totalAuctions)
                .ongoingAuctions(activeAuctions)    // Maps to active in frontend
                .upcomingAuctions(upcomingAuctions)
                .completedAuctions(endedAuctions)   // Maps to ended in frontend
                .unlistedAuctions(unlistedAuctions)
                .deletedAuctions(deletedAuctions)
                .build();
    }

    /**
     * Update an auction with bid restrictions
     */
    public Auction updateAuction(UUID auctionId, AuctionUpdateRequestDTO updateRequest, boolean hasBids) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        // If auction has bids, only allow description updates
        if (hasBids) {
            // Only update description and add edited timestamp
            auction.setDescription(updateRequest.getDescription() + "\n\n[Edited on: " + Instant.now().toString() + "]");
            auction.setIsPublic(updateRequest.isPublic()); // Allow visibility changes
        } else {
            // Full update allowed if no bids
            auction.setTitle(updateRequest.getTitle());
            auction.setDescription(updateRequest.getDescription());
            auction.setStartingPrice(updateRequest.getStartingPrice());
            auction.setCategory(updateRequest.getCategory());
            auction.setIsPublic(updateRequest.isPublic());

            // Parse dates
            try {
                Instant startInstant = Instant.parse(updateRequest.getStartTime());
                Instant endInstant = Instant.parse(updateRequest.getEndTime());
                auction.setStartTime(startInstant);
                auction.setEndTime(endInstant);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format");
            }

            // Handle image updates if provided
            if (updateRequest.getImages() != null && !updateRequest.getImages().isEmpty()) {
                List<UUID> imagePaths = updateRequest.getImages().stream()
                        .map(this::saveImage)
                        .collect(Collectors.toList());
                auction.setImagePaths(imagePaths);
            }
        }

        auction.setUpdatedAt(Instant.now());
        return auctionRepository.save(auction);
    }

    /**
     * Delete an auction with bid restrictions
     */
    public String deleteAuction(UUID auctionId, boolean hasBids) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        if (hasBids) {
            // If auction has bids, mark as pending deletion and unlist
            auction.setDeleted(true);
            auction.setDeletedAt(Instant.now());
            auction.setDeletionStatus("PENDING_ADMIN_APPROVAL");
            auction.setIsPublic(false); // Unlist the auction
            auction.setUpdatedAt(Instant.now());
            auctionRepository.save(auction);

            // Here you would typically send a notification to admin
            // notificationService.notifyAdminForDeletionApproval(auction);

            return "Auction deletion request submitted for admin approval. Auction has been unlisted.";
        } else {
            // If no bids, soft delete immediately
            auction.setDeleted(true);
            auction.setDeletedAt(Instant.now());
            auction.setDeletionStatus("DELETED");
            auction.setUpdatedAt(Instant.now());
            auctionRepository.save(auction);

            return "Auction deleted successfully";
        }
    }

    /**
     * Get auction data for update form
     */
    public AuctionUpdateFormDTO getAuctionForUpdate(UUID auctionId, UUID sellerId) {
        Auction auction = auctionRepository.findById(auctionId).orElse(null);

        if (auction == null || !auction.getSeller().getId().equals(sellerId)) {
            return null;
        }

        List<String> imageIds = auctionImagePathsRepository.findById_AuctionId(auctionId)
                .stream()
                .map(AuctionImagePath::getImageId)
                .map(UUID::toString)
                .collect(Collectors.toList());

        boolean hasBids = bidService.hasAuctionReceivedBids(auctionId);

        return AuctionUpdateFormDTO.builder()
                .id(auction.getId().toString())
                .title(auction.getTitle())
                .description(auction.getDescription())
                .startingPrice(auction.getStartingPrice())
                .startTime(auction.getStartTime().toString())
                .endTime(auction.getEndTime().toString())
                .isPublic(auction.isPublic())
                .category(auction.getCategory())
                .images(imageIds)
                .hasBids(hasBids)
                .canFullyEdit(!hasBids)
                .build();
    }

    /**
     * Get auction by ID (helper method)
     */
    public Auction getAuctionById(UUID id) {
        return auctionRepository.findById(id).orElse(null);
    }

    /**
     * Filter auctions by status - Updated logic
     */
    private List<Auction> filterAuctionsByStatus(List<Auction> auctions, String filter) {
        Instant now = Instant.now();

        switch (filter.toLowerCase()) {
            case "ongoing":
            case "active":
                // Active auctions: started but not ended, public, and not deleted
                return auctions.stream()
                        .filter(a -> a.getStartTime().isBefore(now) &&
                                a.getEndTime().isAfter(now) &&
                                a.isPublic() &&
                                !a.isDeleted())
                        .collect(Collectors.toList());

            case "upcoming":
                // Upcoming auctions: start time is in the future, public, and not deleted
                return auctions.stream()
                        .filter(a -> a.getStartTime().isAfter(now) &&
                                a.isPublic() &&
                                !a.isDeleted())
                        .collect(Collectors.toList());

            case "completed":
            case "ended":
                // Ended auctions: end time is in the past, not deleted
                return auctions.stream()
                        .filter(a -> a.getEndTime().isBefore(now) &&
                                !a.isDeleted())
                        .collect(Collectors.toList());

            case "unlisted":
                // Unlisted auctions: not public OR pending admin approval for deletion
                return auctions.stream()
                        .filter(a -> (!a.isPublic() && !a.isDeleted()) ||
                                (a.isDeleted() && "PENDING_ADMIN_APPROVAL".equals(a.getDeletionStatus())))
                        .collect(Collectors.toList());

            case "deleted":
                // Deleted auctions: marked as deleted
                return auctions.stream()
                        .filter(Auction::isDeleted)
                        .collect(Collectors.toList());

            case "total":
            default:
                // Total auctions: all auctions except deleted ones
                return auctions.stream()
                        .filter(a -> !a.isDeleted())
                        .collect(Collectors.toList());
        }
    }

    /**
     * Convert auction to seller auction DTO
     */
    private SellerAuctionDTO convertToSellerAuctionDTO(Auction auction) {
        Instant now = Instant.now();
        String status = determineAuctionStatus(auction, now);

        // Get current bid count and highest bid
        int bidCount = bidService.getBidCountForAuction(auction.getId());
        BidDTO highestBid = bidService.getHighestBidForAuction(auction.getId())
                .map(bidService::convertToDTO)
                .orElse(null);

        double currentBid = (highestBid != null) ? highestBid.getAmount() : auction.getStartingPrice();

        return SellerAuctionDTO.builder()
                .id(auction.getId().toString())
                .title(auction.getTitle())
                .startTime(auction.getStartTime().toString())
                .endTime(auction.getEndTime().toString())
                .startingPrice(auction.getStartingPrice())
                .currentBid(currentBid)
                .bidCount(bidCount)
                .status(status)
                .isPublic(auction.isPublic())
                .isDeleted(auction.isDeleted())
                .deletionStatus(auction.getDeletionStatus())
                .createdAt(auction.getCreatedAt().toString())
                .updatedAt(auction.getUpdatedAt() != null ? auction.getUpdatedAt().toString() : null)
                .build();
    }

    /**
     * Determine auction status - Updated logic
     */
    private String determineAuctionStatus(Auction auction, Instant now) {
        if (auction.isDeleted()) {
            return auction.getDeletionStatus() != null ?
                    auction.getDeletionStatus() : "DELETED";
        }

        if (!auction.isPublic()) {
            return "UNLISTED";
        }

        // Compare times with server time
        if (auction.getStartTime().isAfter(now)) {
            return "UPCOMING";
        } else if (auction.getEndTime().isBefore(now) || auction.getEndTime().equals(now)) {
            return "ENDED";
        } else {
            return "ONGOING";  // Started but not ended
        }
    }

    /**
     * Helper method to save image (reuse existing method)
     */
    private UUID saveImage(MultipartFile image) {
        try {
            FileUploadResponse uploadRes = uploader.uploadFile(image, FileUploadUseCaseEnum.AUCTION_IMAGE);
            if (uploadRes.isSuccess()) {
                return uploadRes.getUpload().getId();
            } else {
                throw new RuntimeException("Failed to upload image: " + uploadRes.getMessage());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }



}