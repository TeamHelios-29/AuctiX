package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDTO {
    private String chatMessageId;
    private String senderId;
    private String senderUsername;
    private String senderName;
    private String senderRole;
    private String content;
    private String auctionId;
    private String chatRoomId;
    private String timestamp;
}