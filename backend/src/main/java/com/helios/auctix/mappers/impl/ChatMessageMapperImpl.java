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
        ChatMessageDTO chatMessageDTO = modelMapper.map(chatMessage, ChatMessageDTO.class);
        chatMessageDTO.setSenderId(String.valueOf(chatMessage.getSender().getId()));
        chatMessageDTO.setSenderName(chatMessage.getSender().getFirstName() + " " + chatMessage.getSender().getLastName());
        chatMessageDTO.setSenderRole(chatMessage.getSender().getRoleEnum().name());
        chatMessageDTO.setTimestamp(chatMessage.getTimestamp().toString());  // Convert LocalDateTime to String
        return chatMessageDTO;
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
        return modelMapper.map(chatMessageDTO, ChatMessage.class);
    }

}
