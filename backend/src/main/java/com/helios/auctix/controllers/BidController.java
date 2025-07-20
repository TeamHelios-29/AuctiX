package com.helios.auctix.controllers;

import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.dtos.PlaceBidRequest;
import com.helios.auctix.services.BidService;
import com.helios.auctix.services.user.UserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    private final UserDetailsService userDetailsService;

    //to get bid history
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

    //to get the highest bid
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

    //to place new bids
    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody PlaceBidRequest request) {
        try {
            Authentication authentication = SecurityContextHolder
                    .getContext()
                    .getAuthentication();

            User bidder = userDetailsService
                    .getAuthenticatedUser(authentication);

            BidDTO placedBid = bidService.placeBid(request, bidder);
            return ResponseEntity.ok(placedBid);
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
    // Use com.helios.auctix.dtos.PlaceBidRequest instead of inner class.
}