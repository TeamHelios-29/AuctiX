import { useEffect, useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessageDTO } from '@/Interfaces/IChatMessageDTO';
import { IAuthUser } from '@/Interfaces/IAuthUser';
import { useAppSelector } from '@/hooks/hooks';
import AxiosRequest from '@/services/axiosInspector';
import { AxiosInstance } from 'axios';
import { ChatMessageProps } from '@/Interfaces/IChatMessageProps';
import { ChatMessage } from '../atoms/chatMessage';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../atoms/input';
import { Button } from '../atoms/button';

function AuctionChat() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [chatRoomId, setChatRoomId] = useState(
    '5ded2b18-e4c6-4bed-8716-aa551123b469',
  ); // TODO Change
  const user: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);
  const isAuthenticated = !!user && !!user.token;
  const displayName = user?.username || 'Guest';
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionRef = useRef<any>(null);

  const webSocketURL =
    import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws';

  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/public/chat/${chatRoomId}/messages`,
          {
            params: { page: pageNum, size: 4 },
          },
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newMessages: any[] = response.data;
        const reversedNewMessages = [...newMessages].reverse(); // display order is reversed

        if (reversedNewMessages && reversedNewMessages.length > 0) {
          const formattedMessages = reversedNewMessages.map(
            (msg: ChatMessageDTO) => ({
              id: msg.id || Date.now().toString() + Math.random(),
              userId: msg.senderId || '',
              message: msg.content || '',
              displayName: msg.senderName || 'Unknown',
              userRole: msg.senderRole || 'User',
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              isSentByCurrentUser:
                isAuthenticated && msg.senderName === user.username,
            }),
          );
          setMessages((prevMessages) => [
            ...formattedMessages,
            ...prevMessages,
          ]); // prepend new messages
        } else {
          setHasMore(false); // No more messages to load
        }
      } catch (error) {
        console.error('Error fetching messages', error);
      } finally {
        setIsLoading(false);
      }
    },
    [axiosInstance, chatRoomId, isLoading, isAuthenticated, user?.username],
  );

  // Scroll to bottom when new messages are added ( but not when loading old messages)
  const shouldScrollToBottom = useRef(true);

  useEffect(() => {
    if (shouldScrollToBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    shouldScrollToBottom.current = true;
  }, [messages]);

  // preserve scroll position after loading old messages
  useEffect(() => {
    if (page > 0 && !isLoading && messages.length > 0) {
      const container = scrollContainerRef.current;
      if (container) {
        // small timeout to ensure the DOM has updated
        setTimeout(() => {
          // Set scroll position to show the newly loaded messages
          // but not completely at the top to allow loading more
          container.scrollTop = 1;
        }, 100);
      }
    }
  }, [page, isLoading, messages.length]);

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
      connectHeaders: isAuthenticated
        ? { Authorization: `Bearer ${user.token}` }
        : {},
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        // Subscribe to the auction chat topic only if not already subscribed
        if (!subscriptionRef.current) {
          subscriptionRef.current = client.subscribe(
            `/topic/auction/${chatRoomId}/chat`,
            (messageOutput) => {
              try {
                const receivedMessage: ChatMessageDTO = JSON.parse(
                  messageOutput.body,
                );
                console.log('Received message:', receivedMessage);

                if (!receivedMessage.content) {
                  console.error('Received message with no content');
                  return;
                }

                const newChatMessage: ChatMessageProps = {
                  id: receivedMessage.id || Date.now().toString(),
                  userId: receivedMessage.senderId || '',
                  message: receivedMessage.content || '[Empty message]',
                  displayName: receivedMessage.senderName || 'Unknown',
                  userRole: receivedMessage.senderRole || 'User',
                  timestamp: receivedMessage.timestamp
                    ? new Date(receivedMessage.timestamp)
                    : new Date(),
                  isSentByCurrentUser:
                    isAuthenticated &&
                    receivedMessage.senderName === user.username,
                };

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
  }, [chatRoomId, webSocketURL, user, isAuthenticated, displayName]);

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
        auctionId: chatRoomId,
      };

      // Send to server
      stompClient.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`,
        body: JSON.stringify(chatMessage),
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setNewMessage('');

      // Since this is a new message, we'll want to scroll to bottom
      shouldScrollToBottom.current = true;
    } else if (!stompClient || !stompClient.active) {
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isLoading || !hasMore) return;

      console.log('Scroll position:', container.scrollTop);

      if (container.scrollTop === 0) {
        console.log('Reached top, loading more messages');
        shouldScrollToBottom.current = false;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasMore, fetchMessages, page, isLoading]);

  // Load initial messages only once when component mounts
  useEffect(() => {
    fetchMessages(0);
    // Only run this effect once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <h2 className="font-medium">Auction Chat</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {isAuthenticated
              ? 'Connected to chat'
              : 'Connected in Guest Mode (Read Only)'}
          </span>
          <div
            className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
            title={connected ? 'Connected' : 'Disconnected'}
          ></div>
        </div>
      </div>

      <div
        className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]"
        ref={scrollContainerRef}
      >
        {hasMore && (
          <button
            onClick={() => {
              shouldScrollToBottom.current = false;
              const nextPage = page + 1;
              setPage(nextPage);
              fetchMessages(nextPage);
            }}
            className="w-full py-2 mb-4 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load Previous Messages'}
          </button>
        )}

        {isLoading && page === 0 && (
          <div className="text-center text-gray-500">Loading messages...</div>
        )}
        {isLoading && page > 0 && (
          <div className="text-center text-gray-500">
            Loading more messages...
          </div>
        )}
        {messages.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              userId={msg.userId}
              message={msg.message || '[Empty message]'}
              displayName={msg.displayName || 'Unknown'}
              userRole={msg.userRole || 'User'}
              timestamp={msg.timestamp || new Date()}
              isSentByCurrentUser={msg.isSentByCurrentUser}
            />
          ))
        )}
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
