package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.services.WatchListService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchListController {

    private final WatchListService watchListService;

    @GetMapping
    public ResponseEntity<Page<AuctionDetailsDTO>> getMyWatchList(
            @AuthenticationPrincipal User user,
            Pageable pageable
    ) {
        Page<AuctionDetailsDTO> watchedAuctions = watchListService.getWatchedAuctions(user.getId(), pageable);
        return ResponseEntity.ok(watchedAuctions);
    }

    @PostMapping("/{auctionId}")
    public ResponseEntity<Void> subscribeToAuction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID auctionId
    ) {
        watchListService.subscribe(user.getId(), auctionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{auctionId}")
    public ResponseEntity<Void> unsubscribeFromAuction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID auctionId
    ) {
        watchListService.unsubscribe(user.getId(), auctionId);
        return ResponseEntity.noContent().build();
    }
}
