package com.helios.auctix.services;

import com.helios.auctix.domain.chat.ChatMessage;
import com.helios.auctix.domain.chat.ChatRoom;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.repositories.chat.ChatMessageRepository;
import com.helios.auctix.repositories.chat.ChatRoomRepository;
import lombok.extern.java.Log;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Log
@Service
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;

    private final ChatRoomRepository chatRoomRepository;


    public ChatService(ChatMessageRepository chatMessageRepository, ChatRoomRepository chatRoomRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatMessage saveChatMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    public boolean joinChatRoom (User user, String chatRoomId) {

        Optional<ChatRoom> chatRoomOpt = this.chatRoomRepository.findById(UUID.fromString(chatRoomId));

        if (chatRoomOpt.isEmpty()) {
            throw new IllegalArgumentException("There isn't a chat room for the given chatroom id");
        }

        ChatRoom chatRoom = chatRoomOpt.get();

        // Directly insert the user into the chat room participants table. No need to check if user is present in the table
        // "ON CONFLICT DO NOTHING" in the query means if the user is already in the chat room, the insert is ignored.
        chatRoomRepository.addUserToChatRoom(chatRoom.getId(), user.getId());

        log.info("User" + user.getId() + " entered the chat room" + chatRoom.getId());

        return true;
    }

    public ChatRoom getChatRoom(String auctionId) {
//        return this.chatRoomRepository.findChatRoomByAuctionId(UUID.fromString(auctionId));

        // temporary use the acution id as the chatroom id
        return this.chatRoomRepository.findById(UUID.fromString(auctionId)).orElse(null);
    }

//    public List<ChatMessage> getChatMessages(String chatRoomId, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId, pageable);
//    }

    public List<ChatMessage> getMessagesBeforeTimestamp(String chatRoomId, LocalDateTime beforeTimestamp, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("timestamp")));
        return chatMessageRepository.findByChatRoomIdAndTimestampBeforeOrderByTimestampDesc(UUID.fromString(chatRoomId), beforeTimestamp, pageable);
    }
}
