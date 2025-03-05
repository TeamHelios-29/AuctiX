package com.helios.auctix.controllers;

import com.helios.auctix.domain.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage/{auctionId}")
    @SendTo("/auction/{auctionId}")
    public ChatMessage sendMessage(@DestinationVariable String auctionId, @Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.join/{auctionId}")
    @SendTo("/auction/{auctionId}")
    public ChatMessage addUser(@DestinationVariable String auctionId, @Payload ChatMessage chatMessage) {
        chatMessage.setContent(chatMessage.getSenderName() + " joined the auction chat");
        return chatMessage;
    }
}