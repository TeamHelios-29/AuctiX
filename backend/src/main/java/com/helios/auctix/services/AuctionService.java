package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.AuctionImagePath;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.mappers.impl.SellerMapperImpl;
import com.helios.auctix.mappers.impl.UserMapperImpl;
import com.helios.auctix.repositories.AuctionImagePathsRepository;

import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.repositories.AuctionRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
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

        return auctionRepository.save(auction);
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
                .bidHistory(null) // Don't load full history for list view
                .currentHighestBid(highestBid)
                .startingPrice(auction.getStartingPrice())
                .build();
    }



}