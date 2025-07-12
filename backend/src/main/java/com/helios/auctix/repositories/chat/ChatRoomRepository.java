package com.helios.auctix.repositories.chat;

import com.helios.auctix.domain.chat.ChatRoom;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO chat_room_participants (chat_room_id, user_id) VALUES (:chatRoomId, :userId) ON CONFLICT DO NOTHING", nativeQuery = true)
    void addUserToChatRoom(UUID chatRoomId, UUID userId);

    Optional<ChatRoom> findChatRoomByAuctionId(UUID auctionId);
}
