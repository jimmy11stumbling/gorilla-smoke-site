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
  sendMessage: (message: WebSocketMessage) => boolean;
  sendJsonMessage: (message: WebSocketMessage) => boolean;
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
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
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
        console.log('WebSocket disconnected', event.code ? `(code: ${event.code})` : '');
        setReadyState(WebSocket.CLOSED);
        setSocket(null);
        
        if (options.onClose) {
          options.onClose(event);
        }
        
        // Attempt to reconnect unless this was a deliberate closure
        // Code 1000 indicates normal closure, 1001 is going away
        const isDeliberateClosure = event.code === 1000 || event.code === 1001;
        
        if (!isDeliberateClosure && reconnectCount.current < reconnectMaxAttempts) {
          reconnectCount.current += 1;
          
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
          
          // Exponential backoff with jitter for reconnection attempts
          const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
          const delay = reconnectInterval * jitter;
          
          reconnectTimeout.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectCount.current}/${reconnectMaxAttempts})...`);
            connect();
          }, delay);
        }
      };
      
      newSocket.onerror = (event) => {
        console.error('WebSocket error:', event);
        
        if (options.onError) {
          options.onError(event);
        }
        
        // WebSocket will automatically close after an error
        // The reconnection will be handled by the onclose handler
        // No need to manually close the socket here
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
      if (!socket) {
        console.warn('WebSocket instance not available, message not sent:', message);
        return false;
      }
      
      if (socket.readyState !== WebSocket.OPEN) {
        console.warn(`WebSocket not in OPEN state (current state: ${
          socket.readyState === WebSocket.CONNECTING ? 'CONNECTING' :
          socket.readyState === WebSocket.CLOSING ? 'CLOSING' : 'CLOSED'
        }), message not sent:`, message);
        return false;
      }
      
      try {
        socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
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