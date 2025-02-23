package com.helios.auctix.controllers;

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

}
