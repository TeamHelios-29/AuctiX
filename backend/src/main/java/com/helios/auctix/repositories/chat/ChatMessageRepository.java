package com.helios.auctix.repositories.chat;

import com.helios.auctix.domain.chat.ChatMessage;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ChatMessageRepository extends CrudRepository<ChatMessage, UUID> {
}
