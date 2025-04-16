import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketOptions {
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketReturn {
  socket: WebSocket | null;
  readyState: number;
  connected: boolean;
  connecting: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  sendJsonMessage: (message: WebSocketMessage) => void;
  lastMessage: MessageEvent | null;
  reconnect: () => void;
}

export function useWebSocket(
  initialUrl?: string,
  options: WebSocketOptions = {}
): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  
  const reconnectCount = useRef<number>(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectMaxAttempts = options.reconnectAttempts || 10;
  const baseReconnectInterval = options.reconnectInterval || 1000;
  const reconnectInterval = Math.min(baseReconnectInterval * Math.pow(1.5, reconnectCount.current), 10000);
  
  // Get WebSocket URL based on the current location
  const getWebSocketUrl = useCallback(() => {
    if (initialUrl) return initialUrl;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }, [initialUrl]);
  
  // Connect function
  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      const newSocket = new WebSocket(wsUrl);
      
      // Handle websocket events
      newSocket.onopen = (event) => {
        console.log('WebSocket connected');
        setReadyState(WebSocket.OPEN);
        reconnectCount.current = 0;
        
        if (options.onOpen) {
          options.onOpen(event);
        }
      };
      
      newSocket.onmessage = (event) => {
        setLastMessage(event);
        
        if (options.onMessage) {
          options.onMessage(event);
        }
      };
      
      newSocket.onclose = (event) => {
        console.log('WebSocket disconnected');
        setReadyState(WebSocket.CLOSED);
        setSocket(null);
        
        if (options.onClose) {
          options.onClose(event);
        }
        
        // Attempt to reconnect if not a clean close
        if (!event.wasClean && reconnectCount.current < reconnectMaxAttempts) {
          reconnectCount.current += 1;
          
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
          
          reconnectTimeout.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectCount.current}/${reconnectMaxAttempts})...`);
            connect();
          }, reconnectInterval);
        }
      };
      
      newSocket.onerror = (event) => {
        console.error('WebSocket error:', event);
        
        if (options.onError) {
          options.onError(event);
        }
      };
      
      setSocket(newSocket);
      setReadyState(newSocket.readyState);
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [getWebSocketUrl, options, reconnectInterval, reconnectMaxAttempts]);
  
  // Reconnect function
  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    
    reconnectCount.current = 0;
    connect();
  }, [socket, connect]);
  
  // Send message function
  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not connected, message not sent:', message);
      }
    },
    [socket]
  );
  
  // Alias for sendMessage for consistency
  const sendJsonMessage = sendMessage;
  
  // Connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
      
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect, socket]);
  
  // Ping to keep the connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping' });
      }
    }, 30000); // Send ping every 30 seconds
    
    return () => clearInterval(pingInterval);
  }, [socket, sendMessage]);
  
  return {
    socket,
    readyState,
    connected: readyState === WebSocket.OPEN,
    connecting: readyState === WebSocket.CONNECTING,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    reconnect
  };
}