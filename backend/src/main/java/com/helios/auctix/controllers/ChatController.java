package com.helios.auctix.controllers;

import com.helios.auctix.domain.chat.ChatMessage;
import com.helios.auctix.domain.chat.ChatRoom;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.ChatMessageDTO;
import com.helios.auctix.mappers.Mapper;
import com.helios.auctix.services.ChatService;
import com.helios.auctix.services.user.UserRegisterService;
import lombok.extern.java.Log;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.stereotype.Controller;

import static java.lang.Thread.sleep;

/**
 * This is the Controller for the websocket side of Chat, not for the API
 * <p/>
 * For the Checkout ChatRestController for API Controller of Chat
 */
@Log
@Controller
public class ChatController {

    private final ChatService chatService;
    private final UserRegisterService userRegisterService;
    private final Mapper<ChatMessage, ChatMessageDTO> chatMessageDTOMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatService chatService, Mapper<ChatMessage, ChatMessageDTO> chatMessageDTOMapper, UserRegisterService userRegisterService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
        this.chatMessageDTOMapper = chatMessageDTOMapper;
        this.userRegisterService = userRegisterService;
    }

    @MessageMapping("/chat.sendMessage/{auctionId}")
    @SendTo("/topic/auction/{auctionId}/chat")
    public void sendMessage(@DestinationVariable String auctionId,
                                      ChatMessageDTO chatMessageDto,
                                      SimpMessageHeaderAccessor headerAccessor) throws InterruptedException {

//        sleep(500);
//        return chatMessageDto;
        // redundant since the interceptor checks it already
        if (headerAccessor.getUser() == null || headerAccessor.getUser() instanceof AnonymousAuthenticationToken) {
            log.severe("Guest users cannot send messages");
            throw new IllegalArgumentException("You must be logged in to send messages");
        }

        String userEmail = headerAccessor.getUser().getName();
        log.info("Processing message from user: " + userEmail + " for auction: " + auctionId);

        User sender = userRegisterService.getUserFromEmail(userEmail);
        if (sender == null) {
            throw new IllegalArgumentException("Authenticated user not found.");
        }

        ChatRoom chatRoom = chatService.getChatRoom(auctionId);
        if (chatRoom == null) {
            log.severe("ChatRoom not found for the auction id " + auctionId);
            throw new IllegalArgumentException("Chatroom not found for this auction");
        }

        ChatMessage chatMessage = chatMessageDTOMapper.mapFrom(chatMessageDto);
        chatMessage.setSender(sender);
        chatMessage.setChatRoom(chatRoom);
        ChatMessage savedChatMessage = chatService.saveChatMessage(chatMessage);
        log.info("Saved the chat messaage: " + chatMessage.toString());
        ChatMessageDTO responseDto = chatMessageDTOMapper.mapTo(savedChatMessage);
        messagingTemplate.convertAndSend("/topic/auction/" + auctionId + "/chat", responseDto);
    }
}