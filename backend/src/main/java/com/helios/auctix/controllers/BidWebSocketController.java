package com.helios.auctix.controllers;

import com.helios.auctix.dtos.BidDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

// BidWebSocketController.java
@Controller
public class BidWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public BidWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/placeBid/{auctionId}")
    public void handleBid(@DestinationVariable UUID auctionId, BidDTO bidDTO) {
        // Broadcast bid to all subscribers of this auction
        messagingTemplate.convertAndSend("/topic/bids/" + auctionId, bidDTO);
    }
}

