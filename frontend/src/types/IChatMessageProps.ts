export interface ChatMessageProps {
  id: string;
  userId: string;
  message: string;
  displayName: string;
  userRole: string;
  timestamp: Date;
  isSentByCurrentUser: boolean;
}
