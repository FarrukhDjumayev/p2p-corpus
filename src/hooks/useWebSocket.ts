import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { triggerToast } from '@/stores/toast';

export function useWebSocket() {
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAuthStore();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing connections
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (!isAuthenticated || !accessToken) {
      return;
    }

    const connect = () => {
      const loc = window.location;
      const protocol = loc.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${protocol}://${loc.host}/ws/slots?token=${accessToken}`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('Peer Learn real-time WS connection established');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WS message received:', message);

          if (message.type === 'slot_update') {
            queryClient.invalidateQueries({ queryKey: ['slots'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          } else if (message.type === 'notification') {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            triggerToast("Yangi bildirishnoma received!", "info");
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onclose = (event) => {
        console.log('WS connection closed:', event.code, event.reason);
        socketRef.current = null;

        // Code 4401 means authentication failed
        if (event.code === 4401) {
          console.error('WS authentication failed (4401)');
          triggerToast('Aloqa seansi tugadi, iltimos qayta kiring.', 'error');
          useAuthStore.getState().logout();
          return;
        }

        // Reconnect after 3 seconds
        if (isAuthenticated && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            if (useAuthStore.getState().isAuthenticated) {
              console.log('Attempting WS reconnection...');
              connect();
            }
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WS connection error:', error);
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [accessToken, isAuthenticated, queryClient]);
}
export default useWebSocket;
