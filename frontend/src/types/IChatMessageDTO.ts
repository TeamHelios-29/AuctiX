export interface ChatMessageDTO {
  id?: string;
  senderId?: string;
  senderUsername?: string;
  senderName?: string;
  senderRole?: string;
  content: string;
  auctionId?: string;
  chatRoomId?: string;
  timestamp?: Date;
}
