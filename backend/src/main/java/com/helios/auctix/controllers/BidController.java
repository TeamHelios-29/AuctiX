package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.services.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
public class BidController {

    private final BidService bidService;
    private final Logger log = Logger.getLogger(BidController.class.getName());

    @Autowired
    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<BidDTO>> getBidHistoryForAuction(@PathVariable UUID auctionId) {
        try {
            List<Bid> bidHistory = bidService.getBidHistoryForAuction(auctionId);
            List<BidDTO> bidDTOs = bidHistory.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(bidDTOs);
        } catch (Exception e) {
            log.warning("Error fetching bid history for auction " + auctionId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<?> getHighestBidForAuction(@PathVariable UUID auctionId) {
        try {
            Optional<Bid> highestBid = bidService.getHighestBidForAuction(auctionId);
            return highestBid.map(bid -> ResponseEntity.ok(convertToDTO(bid)))
                    .orElseGet(() -> ResponseEntity.ok(null)); // Return null if no bids yet
        } catch (Exception e) {
            log.warning("Error fetching highest bid for auction " + auctionId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody PlaceBidRequest request) {
        try {
            log.info("Received bid request: " + request.toString());

            Bid placedBid = bidService.placeBid(
                    request.getAuctionId(),
                    request.getBidderName(),
                    request.getBidderAvatar(),
                    request.getAmount()
            );

            // Convert to DTO to avoid circular references
            BidDTO bidDTO = convertToDTO(placedBid);
            return ResponseEntity.ok(bidDTO);
        } catch (IllegalArgumentException e) {
            log.warning("Bad request in place bid: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            log.warning("Conflict in place bid: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            log.severe("Error placing bid: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to place bid: " + e.getMessage());
        }
    }

    private BidDTO convertToDTO(Bid bid) {
        return BidDTO.builder()
                .id(bid.getId())
                .auctionId(bid.getAuction().getId())
                .auctionTitle(bid.getAuction().getTitle())
                .bidderId(bid.getBidderId())
                .bidderName(bid.getBidderName())
                .bidderAvatar(bid.getBidderAvatar())
                .amount(bid.getAmount())
                .bidTime(bid.getBidTime())
                .createdAt(bid.getCreatedAt())
                .build();
    }

    // Request DTO for placing bids
    public static class PlaceBidRequest {
        private UUID auctionId;
        private String bidderName;
        private String bidderAvatar;
        private Double amount;

        // Getters and setters
        public UUID getAuctionId() { return auctionId; }
        public void setAuctionId(UUID auctionId) { this.auctionId = auctionId; }

        public String getBidderName() { return bidderName; }
        public void setBidderName(String bidderName) { this.bidderName = bidderName; }

        public String getBidderAvatar() { return bidderAvatar; }
        public void setBidderAvatar(String bidderAvatar) { this.bidderAvatar = bidderAvatar; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }

        @Override
        public String toString() {
            return "PlaceBidRequest{" +
                    "auctionId=" + auctionId +
                    ", bidderName='" + bidderName + '\'' +
                    ", bidderAvatar='" + bidderAvatar + '\'' +
                    ", amount=" + amount +
                    '}';
        }
    }
}