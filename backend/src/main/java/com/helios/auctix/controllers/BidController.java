package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.dtos.PlaceBidRequest;
import com.helios.auctix.services.BidService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class BidController {

    private final BidService bidService;
    private final Logger log = Logger.getLogger(BidController.class.getName());


    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<BidDTO>> getBidHistoryForAuction(@PathVariable UUID auctionId) {
        try {
            List<BidDTO> bidHistory = bidService.getBidHistoryForAuction(auctionId)
                    .stream()
                    .map(bidService::convertToDTO)
                    .toList();
            return ResponseEntity.ok(bidHistory);
        } catch (Exception e) {
            log.warning("Error fetching bid history for auction " + auctionId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<?> getHighestBidForAuction(@PathVariable UUID auctionId) {
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
            BidDTO placedBid = bidService.placeBid(request); // Pass the DTO
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


}
