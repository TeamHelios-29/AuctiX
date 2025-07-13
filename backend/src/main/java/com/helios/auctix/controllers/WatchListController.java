package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.services.WatchListService;
import com.helios.auctix.services.user.UserDetailsService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchListController {

    private final WatchListService watchListService;
    private final UserDetailsService userDetailsService;

    @GetMapping
    public ResponseEntity<Page<AuctionDetailsDTO>> getMyWatchList(
            Pageable pageable
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            Page<AuctionDetailsDTO> watchedAuctions = watchListService.getWatchedAuctions(user.getId(), pageable);
            return ResponseEntity.ok(watchedAuctions);
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @GetMapping("/{auctionId}/is-watched")
    public ResponseEntity<Map<String, Boolean>> isWatched(
            @PathVariable UUID auctionId,
            Authentication authentication
    ) {
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            boolean watched = watchListService.isWatchedByUser(user, auctionId);
            return ResponseEntity.ok(Map.of("isWatched", watched));
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }
    }

    @PostMapping("/{auctionId}")
    public ResponseEntity<Void> subscribeToAuction(
            @PathVariable UUID auctionId
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            watchListService.subscribe(user.getId(), auctionId);
            return ResponseEntity.ok().build();
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }

    }

    @DeleteMapping("/{auctionId}")
    public ResponseEntity<Void> unsubscribeFromAuction(
            @PathVariable UUID auctionId
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            User user = userDetailsService.getAuthenticatedUser(authentication);
            watchListService.unsubscribe(user.getId(), auctionId);
            return ResponseEntity.noContent().build();
        } catch (AuthenticationException e) {
            throw new RuntimeException("User not authenticated");
        }

    }
}
