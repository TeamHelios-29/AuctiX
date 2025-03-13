import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage, ChatMessageProps } from './ui/chatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';
import { ChatMessageDTO } from '@/Interfaces/IChatMessageDTO';
// import { useAuth } from '@/context/AuthContext';/

function AuctionChat() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [auctionId, setAuctionId] = useState('1');
  const [tempUserId, setTempUserId] = useState('1');

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
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        client.subscribe(
          `/topic/auction/${auctionId}/chat`,
          (messageOutput) => {
            try {
              const receivedMessage: ChatMessageDTO = JSON.parse(
                messageOutput.body,
              );
              console.log('Received message:', receivedMessage);

              const newChatMessage: ChatMessageProps = {
                id: Date.now().toString(), // just to make it unique
                userId: tempUserId,
                message: receivedMessage.content,
                displayName: receivedMessage.senderName || 'Unknown',
                userRole: 'Seller', // Default role
                timestamp: receivedMessage.timestamp
                  ? new Date(receivedMessage.timestamp)
                  : new Date(),
                isSentByCurrentUser: receivedMessage.senderName === tempUserId,
              };

              setMessages((prevMessages) => [...prevMessages, newChatMessage]);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          },
        );

        // join the chat room for the auction id
        client.publish({
          destination: `/app/chat.join/${auctionId}`,
          body: JSON.stringify({
            senderName: tempUserId,
            content: '',
            auctionId: auctionId,
          }),
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
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
  }, [auctionId, webSocketURL, tempUserId]);

  const sendMessage = () => {
    if (stompClient && stompClient.active && newMessage.trim() !== '') {
      console.log('Sending message:', newMessage);

      const chatMessage: ChatMessageDTO = {
        senderId: tempUserId,
        content: newMessage,
      };

      // const frontendMessage: ChatMessageProps = {
      //   id: Date.now().toString(),
      //   userId: 'currentUser',
      //   message: newMessage,
      //   displayName: 'You',
      //   userRole: 'User',
      //   timestamp: new Date(),
      //   isSentByCurrentUser: true,
      // };

      // setMessages((prevMessages) => [...prevMessages, frontendMessage]);

      // Then send to server
      stompClient.publish({
        destination: `/app/chat.sendMessage/${auctionId}`,
        body: JSON.stringify(chatMessage),
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
        <div
          className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
          title={connected ? 'Connected' : 'Disconnected'}
        ></div>
      </div>
      <div>
        Set User ID for testing:
        <input
          type="text"
          value={tempUserId}
          onChange={(e) => setTempUserId(e.target.value)}
        />
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
              placeholder="Type a message..."
              id="message"
              autoComplete="off"
              required
              className="flex-1"
              disabled={!connected}
            />
            <Button type="submit" disabled={!connected}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuctionChat;
