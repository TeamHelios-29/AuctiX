package com.helios.auctix.controllers;

import com.helios.auctix.domain.chat.ChatMessage;
import com.helios.auctix.domain.chat.ChatRoom;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.ChatMessageDTO;
import com.helios.auctix.mappers.Mapper;
import com.helios.auctix.services.ChatService;
import com.helios.auctix.services.user.UserService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.time.LocalDateTime;

@Log
@Controller
public class ChatController {

    private ChatService chatService;

    private UserService userService;

    private Mapper<ChatMessage, ChatMessageDTO> chatMessageDTOMapper;

    public ChatController(ChatService chatService, Mapper<ChatMessage, ChatMessageDTO> chatMessageDTOMapper, UserService userService ) {
        this.chatService = chatService;
        this.chatMessageDTOMapper = chatMessageDTOMapper;
        this.userService = userService;
    }

    @MessageMapping("/chat.sendMessage/{auctionId}")
    @SendTo("/topic/auction/{auctionId}/chat")
    public ChatMessageDTO sendMessage(@DestinationVariable String auctionId, @RequestBody ChatMessageDTO chatMessageDto, Principal principal) {

        String userEmail = principal.getName();
        User sender = userService.getUserFromEmail(userEmail);

        if (sender == null) {
            throw new IllegalArgumentException("Authenticated user not found.");
        }

        ChatRoom chatRoom = chatService.getChatRoom(auctionId);

        if (chatRoom == null) {
            log.severe("ChatRoom not found for the auction id " + auctionId);
            throw new IllegalArgumentException("Chatroom not found for this auction");
        }

        ChatMessage chatMessage =  chatMessageDTOMapper.mapFrom(chatMessageDto);
        chatMessage.setSender(sender);
        chatMessage.setChatRoom(chatRoom);
        ChatMessage savedChatMessage = chatService.saveChatMessage(chatMessage);

        return chatMessageDTOMapper.mapTo(savedChatMessage);

    }

    @MessageMapping("/chat.join/{auctionId}")
    @SendTo("/topic/auction/{auctionId}/chat")
    public void addUser(@DestinationVariable String auctionId, @Payload ChatMessage chatMessage, Principal principal) {

        String userEmail = principal.getName();
        User sender = userService.getUserFromEmail(userEmail);

        if (sender == null) {
            throw new IllegalArgumentException("Authenticated user not found.");
        }

        // TODO refactor
        // for now use the auction id as the chat room id
        chatService.joinChatRoom(sender, auctionId);

    }
}