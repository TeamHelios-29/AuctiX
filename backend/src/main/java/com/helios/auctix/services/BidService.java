package com.example.biddingapp.service;

import com.example.biddingapp.entity.Bid;
import com.example.biddingapp.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BidService {

    private final BidRepository bidRepository;

    @Autowired
    public BidService(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    // Create a new bid
    public Bid createBid(Bid bid) {
        // Add any business logic/validation here
        bid.setCreatedAt(LocalDateTime.now());
        bid.setUpdatedAt(LocalDateTime.now());
        return bidRepository.save(bid);
    }

    // Retrieve all bids
    public List<Bid> getAllBids() {
        return bidRepository.findAll();
    }

    // Retrieve a bid by ID
    public Optional<Bid> getBidById(Long id) {
        return bidRepository.findById(id);
    }

    // Update a bid
    public Bid updateBid(Long id, Bid updatedBid) {
        return bidRepository.findById(id)
                .map(bid -> {
                    bid.setAmount(updatedBid.getAmount());
                    bid.setBidTime(updatedBid.getBidTime());
                    bid.setUpdatedAt(LocalDateTime.now());
                    return bidRepository.save(bid);
                })
                .orElseThrow(() -> new RuntimeException("Bid not found with id: " + id));
    }

    // Delete a bid
    public void deleteBid(Long id) {
        bidRepository.deleteById(id);
    }

    // Custom business logic: Find bids with amount greater than a specified value
    public List<Bid> findBidsWithAmountGreaterThan(Double amount) {
        return bidRepository.findByAmountGreaterThan(amount);
    }

    // Custom business logic: Find bids within a specific time range
    public List<Bid> findBidsBetweenDates(LocalDateTime start, LocalDateTime end) {
        return bidRepository.findByBidTimeBetween(start, end);
    }
}