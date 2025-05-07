package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.services.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
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
    public ResponseEntity<List<Bid>> getBidHistoryForAuction(@PathVariable Long auctionId) {
        try {
            List<Bid> bidHistory = bidService.getBidHistoryForAuction(auctionId);
            return ResponseEntity.ok(bidHistory);
        } catch (Exception e) {
            log.warning("Error fetching bid history for auction " + auctionId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<?> getHighestBidForAuction(@PathVariable Long auctionId) {
        try {
            Optional<Bid> highestBid = bidService.getHighestBidForAuction(auctionId);
            return highestBid.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.ok(null)); // Return null if no bids yet
        } catch (Exception e) {
            log.warning("Error fetching highest bid for auction " + auctionId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody PlaceBidRequest request) {
        try {
            Bid placedBid = bidService.placeBid(
                    request.getAuctionId(),
                    request.getBidderId(),
                    request.getBidderName(),
                    request.getBidderAvatar(),
                    request.getAmount()
            );
            return ResponseEntity.ok(placedBid);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            log.warning("Error placing bid: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to place bid");
        }
    }

    // Request DTO for placing bids
    public static class PlaceBidRequest {
        private Long auctionId;
        private Long bidderId;
        private String bidderName;
        private String bidderAvatar;
        private Double amount;

        // Getters and setters
        public Long getAuctionId() { return auctionId; }
        public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

        public Long getBidderId() { return bidderId; }
        public void setBidderId(Long bidderId) { this.bidderId = bidderId; }

        public String getBidderName() { return bidderName; }
        public void setBidderName(String bidderName) { this.bidderName = bidderName; }

        public String getBidderAvatar() { return bidderAvatar; }
        public void setBidderAvatar(String bidderAvatar) { this.bidderAvatar = bidderAvatar; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
}
