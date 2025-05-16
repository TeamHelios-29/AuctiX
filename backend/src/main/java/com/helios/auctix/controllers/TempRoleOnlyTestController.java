package com.helios.auctix.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/roletest")
@RestController
public class TempRoleOnlyTestController {

    @GetMapping("/seller")
    public String sellerOnly() {
        // Set the Authorization header of request "Bearer <jwt>"
        // eg
        // Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0b20iLCJyb2xlIjoiU0VMTEVSIiwiaWF0IjoxNzM5MzI2NjExLCJleHAiOjE3MzkzNDgyMTF9.hSsscrLFTq43dpx5lCSO3U78o9KAOdGZ63TgIusLCbk

        return "This is a seller only route";
    }

    @GetMapping("/bidder")
    public String bidderOnly() {
        return "This is a bidder only route";
    }

    @GetMapping("/test-auth")
    public String testAuth(@AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("Auth Principal Gives" + userDetails.getUsername()); // works! : Auth Principal Givestom4@test.com


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("Security Context gives" + authentication.getName()); // works! Security Context givestom4@test.com


        return "This is what we have" + userDetails.getUsername() + "and in context" + authentication.getName();



    }
}
