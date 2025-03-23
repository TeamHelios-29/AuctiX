package com.helios.auctix.controllers;


import com.helios.auctix.domain.chat.ChatMessage;
import com.helios.auctix.dtos.ChatMessageDTO;
import com.helios.auctix.mappers.Mapper;
import com.helios.auctix.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/api/public/chat")  // Getting chat messages should be allowed for non-logged-in users as well
@RestController
public class ChatRestController  {

    private final ChatService chatService;
    private final Mapper<ChatMessage, ChatMessageDTO> chatMessageDTOMapper;

    public ChatRestController(ChatService chatService, Mapper<ChatMessage, ChatMessageDTO> chatMessageDTOMapper) {
        this.chatService = chatService;
        this.chatMessageDTOMapper = chatMessageDTOMapper;
    }

    @GetMapping("/hello")
    public String sayHi() {
        return "Hello World";
    }

    @GetMapping("/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getChatMessages(
            @PathVariable String chatRoomId,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false)  LocalDateTime beforeTimestamp) {

        if (beforeTimestamp == null) {
            beforeTimestamp = LocalDateTime.now();
        }

        List<ChatMessage> messages = chatService.getMessagesBeforeTimestamp(
                chatRoomId, beforeTimestamp, page, size);

        List<ChatMessageDTO> response = messages.stream()
                .map(chatMessageDTOMapper::mapTo)
                .toList();

        return ResponseEntity.ok(response);
    }
}
