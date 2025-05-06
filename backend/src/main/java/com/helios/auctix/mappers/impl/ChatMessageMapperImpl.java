package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.chat.ChatMessage;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.ChatMessageDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Log
@Component
public class ChatMessageMapperImpl implements Mapper<ChatMessage, ChatMessageDTO> {

    private final ModelMapper modelMapper;

    public ChatMessageMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public ChatMessageDTO mapTo(ChatMessage chatMessage) {
//        ChatMessageDTO chatMessageDTO = modelMapper.map(chatMessage, ChatMessageDTO.class);
        // Convert LocalDateTime to String

        return ChatMessageDTO.builder()
                .chatMessageId(String.valueOf(chatMessage.getId()))
                .senderId(String.valueOf(chatMessage.getSender().getId()))
                .senderUsername(chatMessage.getSender().getUsername())
                .senderName(chatMessage.getSender().getFirstName() + " " + chatMessage.getSender().getLastName())
                .senderRole(chatMessage.getSender().getRoleEnum().name())
                .content(chatMessage.getContent())
                .timestamp(chatMessage.getTimestamp().toString())  // Convert LocalDateTime to String
                .build();

    }

    /**
     * Maps to a ChatMessage entity
     * However, this method does not fetch users, chatroom or auction from DB.
     * The service using this method should provide those objects to the ChatMessage object later by setting them
     * @param chatMessageDTO
     * @return ChatMessage
     */
    @Override
    public ChatMessage mapFrom(ChatMessageDTO chatMessageDTO) {
//        return modelMapper.map(chatMessageDTO, ChatMessage.class);

        return ChatMessage.builder()
                .content(chatMessageDTO.getContent())
                .build();
    }

}
