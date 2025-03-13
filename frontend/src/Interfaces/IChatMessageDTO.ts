export interface ChatMessageDTO {
  senderId: string;
  senderName?: string;
  senderRole?: string;
  content: string;
  auctionId?: string;
  chatRoomId?: string;
  timestamp?: Date;
}
