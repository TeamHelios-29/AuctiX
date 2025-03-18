import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage, ChatMessageProps } from './ui/chatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';
import { ChatMessageDTO } from '@/Interfaces/IChatMessageDTO';
import { IAuthUser } from '@/Interfaces/IAuthUser';
import { useAppSelector } from '@/services/hooks';

function AuctionChat() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [auctionId, setAuctionId] = useState(
    '5ded2b18-e4c6-4bed-8716-aa551123b469',
  ); // TODO Change
  const user: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);
  const isAuthenticated = !!user && !!user.token;
  const displayName = user?.username || 'Guest';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionRef = useRef<any>(null); // Track subscription status

  const webSocketURL =
    import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws';

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(webSocketURL),
      debug: function (str) {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Conditionally set headers based on authentication status
      connectHeaders: isAuthenticated
        ? { Authorization: `Bearer ${user.token}` }
        : {},
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        // Subscribe to the auction chat topic only if not already subscribed
        if (!subscriptionRef.current) {
          subscriptionRef.current = client.subscribe(
            `/topic/auction/${auctionId}/chat`,
            (messageOutput) => {
              try {
                const receivedMessage: ChatMessageDTO = JSON.parse(
                  messageOutput.body,
                );
                console.log('Received message:', receivedMessage);

                const newChatMessage: ChatMessageProps = {
                  id: Date.now().toString(), // just to make it unique
                  userId: receivedMessage.senderId || '',
                  message: receivedMessage.content,
                  displayName: receivedMessage.senderName || 'Unknown',
                  userRole: receivedMessage.senderRole || 'User',
                  timestamp: receivedMessage.timestamp
                    ? new Date(receivedMessage.timestamp)
                    : new Date(),
                  isSentByCurrentUser:
                    isAuthenticated &&
                    receivedMessage.senderName === user.username,
                };

                console.log('sender name', receivedMessage.senderName);
                console.log('user name', user.username);

                setMessages((prevMessages) => [
                  ...prevMessages,
                  newChatMessage,
                ]);
              } catch (error) {
                console.error('Error parsing message:', error);
              }
            },
            isAuthenticated ? { Authorization: `Bearer ${user.token}` } : {},
          );
        }

        // // Only join the chat if authenticated
        // if (isAuthenticated) {
        //   // join the chat room for the auction id (only once)
        //   client.publish({
        //     destination: `/app/chat.join/${auctionId}`,
        //     body: JSON.stringify({
        //       // senderId: user.id,
        //       senderName: displayName,
        //       content: '',
        //       auctionId: auctionId,
        //     }),
        //     headers: {
        //       Authorization: `Bearer ${user.token}`,
        //     },
        //   });
        // }
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
        // Cleanup subscription when disconnecting
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
        setConnected(false);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
        setConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [auctionId, webSocketURL, user, isAuthenticated, displayName]);

  const sendMessage = () => {
    if (!isAuthenticated) {
      console.error('Cannot send messages in guest mode');
      return;
    }

    if (stompClient && stompClient.active && newMessage.trim() !== '') {
      console.log('Sending message:', newMessage);

      const chatMessage: ChatMessageDTO = {
        senderId: displayName,
        senderName: displayName,
        content: newMessage,
        auctionId: auctionId,
      };

      // Send to server
      stompClient.publish({
        destination: `/app/chat.sendMessage/${auctionId}`,
        body: JSON.stringify(chatMessage),
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setNewMessage('');
    } else if (!stompClient || !stompClient.active) {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <h2 className="font-medium">Auction Chat</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {isAuthenticated ? displayName : 'Guest Mode (Read Only)'}
          </span>
          <div
            className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
            title={connected ? 'Connected' : 'Disconnected'}
          ></div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div className="flex flex-row items-center space-x-2">
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isAuthenticated ? 'Type a message...' : 'Login to chat'
              }
              id="message"
              autoComplete="off"
              required
              className="flex-1"
              disabled={!connected || !isAuthenticated}
            />
            <Button type="submit" disabled={!connected || !isAuthenticated}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuctionChat;
