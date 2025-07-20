import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useAuctionWebSocket = (
  auctionId: string,
  onBidUpdate: (data: any) => void,
) => {
  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/ws-auction`);

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');

        client.subscribe(`/topic/auction/${auctionId}`, (message) => {
          const payload = JSON.parse(message.body);
          onBidUpdate(payload);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      },
    });

    client.activate();

    return () => {
      if (client.connected) client.deactivate();
    };
  }, [auctionId, onBidUpdate]);
};
