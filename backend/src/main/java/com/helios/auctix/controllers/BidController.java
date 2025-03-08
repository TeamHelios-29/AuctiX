package com.example.biddingapp.controller;

import com.example.biddingapp.entity.Bid;
import com.example.biddingapp.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidService bidService;

    @Autowired
    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    // Create a new bid
    @PostMapping
    public Bid createBid(@RequestBody Bid bid) {
        return bidService.createBid(bid);
    }

    // Retrieve all bids
    @GetMapping
    public List<Bid> getAllBids() {
        return bidService.getAllBids();
    }

    // Retrieve a bid by ID
    @GetMapping("/{id}")
    public Optional<Bid> getBidById(@PathVariable Long id) {
        return bidService.getBidById(id);
    }

    // Update a bid
    @PutMapping("/{id}")
    public Bid updateBid(@PathVariable Long id, @RequestBody Bid updatedBid) {
        return bidService.updateBid(id, updatedBid);
    }

    // Delete a bid
    @DeleteMapping("/{id}")
    public void deleteBid(@PathVariable Long id) {
        bidService.deleteBid(id);
    }

    // Custom endpoint: Find bids with amount greater than a specified value
    @GetMapping("/amountGreaterThan")
    public List<Bid> findBidsWithAmountGreaterThan(@RequestParam Double amount) {
        return bidService.findBidsWithAmountGreaterThan(amount);
    }

    // Custom endpoint: Find bids within a specific time range
    @GetMapping("/betweenDates")
    public List<Bid> findBidsBetweenDates(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return bidService.findBidsBetweenDates(start, end);
    }
}