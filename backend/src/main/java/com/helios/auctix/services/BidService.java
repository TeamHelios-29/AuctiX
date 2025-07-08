package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.dtos.PlaceBidRequest;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.mappers.impl.UserMapperImpl;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.BidRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@AllArgsConstructor
@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserMapperImpl userMapperImpl;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    // Get bid history for an auction
    public List<Bid> getBidHistoryForAuction(UUID auctionId) {
        return bidRepository.findByAuctionIdOrderByBidTimeDesc(auctionId)
                .stream()
                .limit(10)
                .toList();
    }

    // Get the highest bid for an auction
    public Optional<Bid> getHighestBidForAuction(UUID auctionId) {
        return bidRepository.findTopByAuctionIdOrderByAmountDesc(auctionId);
    }

    // Add this method to get bidder details
    public BidDTO convertToDTO(Bid bid) {

        User bidder = userRepository.findById(bid.getBidderId()).orElse(null);

        UserDTO bidderDto = userMapperImpl.mapTo(bidder);


        return BidDTO.builder()
                .id(bid.getId())
                .auctionId(bid.getAuction().getId())
                .amount(bid.getAmount())
                .bidTime(bid.getBidTime())
                .bidder(bidderDto)
                .build();
    }

    // Method for placing a new bid
    @Transactional
    public BidDTO placeBid(PlaceBidRequest request, User bidder) {

        UUID auctionId = request.getAuctionId();
        Double amount = request.getAmount();

        UUID bidderId = bidder.getId();
        String bidderName = bidder.getFirstName() + " " + bidder.getLastName();
        UUID bidderAvatar = null;
        if(bidder.getUpload()!=null){
             bidderAvatar = bidder.getUpload().getId();
        }


        // Find the auction given through request
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        // Check if auction is active
        Instant now = Instant.now();
        if (now.isBefore(auction.getStartTime()) || now.isAfter(auction.getEndTime())) {
            throw new IllegalStateException("Auction is not active");
        }

        // Set bidTime server-side
        Instant bidTime = Instant.now(); // 🚀 Always use server time

        // Check if bid amount is valid
        Optional<Bid> highestBid = getHighestBidForAuction(auctionId);
        if (highestBid.isPresent()) {
            if (amount <= highestBid.get().getAmount()) {
                throw new IllegalArgumentException("Bid amount must be higher than current highest bid");
            }
        } else {
            // No bids yet, check against starting price
            if (amount < auction.getStartingPrice()) {
                throw new IllegalArgumentException("Bid amount must be at least the starting price");
            }
        }

        // Create and save the bid
        Bid bid = Bid.builder()
                .auction(auction)
                .bidderId(bidderId)
                .bidderName(bidderName)
                .bidderAvatar(String.valueOf(bidderAvatar))
                .amount(amount)
                .bidTime(now)
                .build();

        Bid savedBid = bidRepository.save(bid);

        return convertToDTO(savedBid);

    }
}
