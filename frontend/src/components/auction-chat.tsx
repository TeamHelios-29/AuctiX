// import { useEffect, useState, useRef } from 'react';
// import { Stomp } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

import ChatMessage from './ui/chatMessage';

function AuctionChat() {
  // const [stompClient, setStompClient] = useState(null);
  // const [connected, setConnected] = useState(false);
  // const [messages, setMessages] = useState([]);
  // const [newMessage, setNewMessage] = useState('');
  // const messagesEndRef = useRef(null);

  return (
    <div>
      <div className="flex flex-col gap-4 p-6 bg-gray-100 min-h-screen">
        <ChatMessage
          message="This is a test message"
          displayName="John Doe"
          userRole="Seller"
          timestamp={new Date('2023-10-01T12:16:50')}
          isSentByCurrentUser={false}
        />

        <ChatMessage
          message="This is a test message"
          displayName="Jane Smith"
          userRole="Buyer"
          timestamp={new Date('2023-10-01T12:18:30')}
          isSentByCurrentUser={false}
        />

        <ChatMessage
          message="This is a test message"
          displayName="You"
          userRole="Buyer"
          timestamp={new Date('2023-10-01T12:20:15')}
          isSentByCurrentUser={true}
        />

        <ChatMessage
          message="This is a test message"
          displayName="You"
          userRole="Seller"
          timestamp={new Date('2023-10-01T12:21:45')}
          isSentByCurrentUser={true}
        />
      </div>
    </div>
  );
}

export default AuctionChat;
