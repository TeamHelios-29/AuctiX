package com.helios.auctix.repositories.chat;

import com.helios.auctix.domain.chat.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends CrudRepository<ChatMessage, UUID> {
//    List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(String chatRoomId, Pageable pageable);

    List<ChatMessage> findByChatRoomIdAndTimestampBeforeOrderByTimestampDesc(
            UUID chatRoomId, LocalDateTime beforeTimestamp, Pageable pageable);
}
