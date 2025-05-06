package com.helios.auctix.domain.chat;


import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", referencedColumnName = "id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = false)
    private User sender;

    private String content;
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        timestamp = LocalDateTime.now();
        this.id = UUID.randomUUID();  // so it won't give an error when we try to save a msg without an id
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id=" + id +
                ", chatRoom=" + chatRoom +
                ", sender=" + sender.getEmail() +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}