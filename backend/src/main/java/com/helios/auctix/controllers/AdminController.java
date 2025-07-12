package com.helios.auctix.controllers;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.services.AuctionSchedulerService;
import com.helios.auctix.services.user.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuctionSchedulerService auctionSchedulerService;
    private final UserDetailsService userDetailsService;
    private static final Logger logger = Logger.getLogger(AdminController.class.getName());

    @Autowired
    public AdminController(AuctionSchedulerService auctionSchedulerService, UserDetailsService userDetailsService) {
        this.auctionSchedulerService = auctionSchedulerService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Admin endpoint to manually complete an auction
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @PostMapping("/auctions/{auctionId}/complete")
    public ResponseEntity<?> completeAuction(@PathVariable UUID auctionId) {
        try {
            // Get the current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userDetailsService.getAuthenticatedUser(authentication);

            logger.info("Admin " + currentUser.getUsername() + " is manually completing auction: " + auctionId);

            auctionSchedulerService.manuallyCompleteAuction(auctionId);

            return ResponseEntity.ok().body("Auction completed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.severe("Error completing auction: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error completing auction: " + e.getMessage());
        }
    }

    /**
     * Admin endpoint to trigger the auction completion process for all eligible auctions
     */
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @PostMapping("/auctions/process-completed")
    public ResponseEntity<?> processCompletedAuctions() {
        try {
            // Get the current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userDetailsService.getAuthenticatedUser(authentication);

            logger.info("Admin " + currentUser.getUsername() + " is manually processing completed auctions");

            auctionSchedulerService.processCompletedAuctions();

            return ResponseEntity.ok().body("Completed auctions processed successfully");
        } catch (Exception e) {
            logger.severe("Error processing completed auctions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing completed auctions: " + e.getMessage());
        }
    }
}