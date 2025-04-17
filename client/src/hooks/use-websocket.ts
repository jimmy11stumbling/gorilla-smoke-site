import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketOptions {
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  shouldConnect?: boolean; // Allow conditional connection
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
        
        // Check if browser tab is active - don't attempt reconnect if tab is in background
        if (document.hidden) {
          console.log('Tab is not active, delaying reconnection');
          return;
        }
        
        // Attempt to reconnect unless this was a deliberate closure or connection limit
        // Code 1000 indicates normal closure, 1001 is going away, 1013 is server overload
        const isDeliberateClosure = event.code === 1000 || event.code === 1001;
        const isServerOverload = event.code === 1013;
        
        if (isServerOverload) {
          console.log('Server connection limit reached, waiting longer before reconnecting');
          // For server overload, wait longer before reconnecting
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
          reconnectTimeout.current = setTimeout(() => {
            reconnectCount.current = 0; // Reset counter for a fresh start
            connect();
          }, 15000); // Wait 15 seconds before trying again
          return;
        }
        
        if (!isDeliberateClosure && reconnectCount.current < reconnectMaxAttempts) {
          reconnectCount.current += 1;
          
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
          
          // Improved exponential backoff with jitter for reconnection attempts
          // Add more jitter as reconnect count increases to prevent connection storms
          const jitterFactor = Math.min(reconnectCount.current * 0.2, 0.9); // Up to 90% jitter
          const jitter = (Math.random() * jitterFactor * 2 + (1 - jitterFactor)) * reconnectInterval;
          const delay = Math.min(jitter, 30000); // Cap at 30 seconds
          
          reconnectTimeout.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectCount.current}/${reconnectMaxAttempts})...`);
            connect();
          }, delay);
        } else if (reconnectCount.current >= reconnectMaxAttempts) {
          console.warn(`Maximum reconnect attempts (${reconnectMaxAttempts}) reached, pausing reconnection attempts.`);
          // Reset after a long timeout to try again eventually
          reconnectTimeout.current = setTimeout(() => {
            console.log('Resetting reconnection counter and trying again');
            reconnectCount.current = 0;
            connect();
          }, 60000); // Wait 1 minute before trying again
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
  
  // Connect on mount and handle visibility changes and shouldConnect option
  useEffect(() => {
    // If shouldConnect is explicitly false, don't connect
    const shouldConnectValue = options.shouldConnect !== undefined ? options.shouldConnect : true;
    
    if (shouldConnectValue) {
      // Initial connection
      connect();
      
      // Handle tab visibility changes
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // Tab became visible again, check if we need to reconnect
          if ((!socket || socket.readyState !== WebSocket.OPEN) && shouldConnectValue) {
            console.log('Tab became visible, reconnecting WebSocket if needed');
            // Reset reconnect counter and attempt a fresh connection
            reconnectCount.current = 0;
            connect();
          }
        } else {
          // Tab is now hidden, we could optionally close the connection here
          // to save server resources, but for real-time updates we'll keep it open
          console.log('Tab hidden, maintaining WebSocket connection');
        }
      };
      
      // Add visibility change listener
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup
      return () => {
        if (socket) {
          socket.close();
        }
        
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
        
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      // Clean up existing connection if shouldConnect changed to false
      if (socket) {
        console.log('shouldConnect is false, closing WebSocket connection');
        socket.close();
        setSocket(null);
      }
      
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    }
  }, [connect, socket, options.shouldConnect]);
  
  // Ping to keep the connection alive with improved error handling
  useEffect(() => {
    // Only set up ping if we have a socket
    if (!socket) return;
    
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        // Try to send ping but don't throw errors if it fails
        try {
          sendMessage({ type: 'ping' });
        } catch (err) {
          console.warn('Ping failed:', err);
          // Don't attempt reconnect here - let the onclose handler do it
        }
      }
    }, 30000); // Send ping every 30 seconds
    
    return () => {
      clearInterval(pingInterval);
    };
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