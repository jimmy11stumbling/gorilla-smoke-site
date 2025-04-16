import { useState, useEffect, useCallback, useRef } from 'react';

type MessageHandler = (data: any) => void;

interface WebSocketHookOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  manualOpen?: boolean;
}

interface WebSocketHookReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  sendMessage: (message: any) => void;
  connect: () => void;
  disconnect: () => void;
  connectionCount: number;
}

/**
 * A hook to connect to the WebSocket server and handle real-time communication
 */
export function useWebSocket(
  handlers: Record<string, MessageHandler> = {},
  options: WebSocketHookOptions = {}
): WebSocketHookReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const handlersRef = useRef(handlers);
  
  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);
  
  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (webSocketRef.current) {
      // Remove all event listeners to prevent memory leaks
      webSocketRef.current.onopen = null;
      webSocketRef.current.onclose = null;
      webSocketRef.current.onmessage = null;
      webSocketRef.current.onerror = null;
      
      // Close the connection if it's still open
      if (webSocketRef.current.readyState === WebSocket.OPEN || 
          webSocketRef.current.readyState === WebSocket.CONNECTING) {
        webSocketRef.current.close();
      }
      
      webSocketRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);
  
  // Connect to the WebSocket server
  const connect = useCallback(() => {
    // Don't try to connect if already connecting or connected
    if (isConnecting || (webSocketRef.current && 
        (webSocketRef.current.readyState === WebSocket.OPEN || 
         webSocketRef.current.readyState === WebSocket.CONNECTING))) {
      return;
    }
    
    // Clean up any existing connection
    cleanup();
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Determine the WebSocket URL based on the current protocol and host
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      // Create a new WebSocket connection
      const socket = new WebSocket(wsUrl);
      webSocketRef.current = socket;
      
      // Handle connection open
      socket.onopen = (event) => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionCount(prev => prev + 1);
        reconnectAttemptsRef.current = 0;
        
        // Call the onOpen callback if provided
        if (options.onOpen) {
          options.onOpen(event);
        }
      };
      
      // Handle incoming messages
      socket.onmessage = (event) => {
        try {
          // Parse the message data as JSON
          const data = JSON.parse(event.data);
          
          // Call the appropriate handler based on the message type
          if (data.type && handlersRef.current[data.type]) {
            handlersRef.current[data.type](data);
          } else if (handlersRef.current['*']) {
            // Call the catch-all handler if available
            handlersRef.current['*'](data);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      
      // Handle connection close
      socket.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        
        // Call the onClose callback if provided
        if (options.onClose) {
          options.onClose(event);
        }
        
        // Attempt to reconnect if not closed cleanly and we haven't exceeded max attempts
        const maxAttempts = options.reconnectAttempts ?? 5;
        if (!event.wasClean && reconnectAttemptsRef.current < maxAttempts) {
          const reconnectInterval = options.reconnectInterval ?? 3000;
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };
      
      // Handle connection errors
      socket.onerror = (event) => {
        setError(new Error('WebSocket connection error'));
        setIsConnecting(false);
        
        // Call the onError callback if provided
        if (options.onError) {
          options.onError(event);
        }
      };
    } catch (err) {
      setIsConnecting(false);
      setError(err instanceof Error ? err : new Error('Failed to connect to WebSocket server'));
      console.error('Error creating WebSocket connection:', err);
    }
  }, [isConnecting, cleanup, options]);
  
  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);
  
  // Send a message to the WebSocket server
  const sendMessage = useCallback((message: any) => {
    if (!webSocketRef.current || webSocketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message, WebSocket is not connected');
      return;
    }
    
    try {
      const messageStr = typeof message === 'string' 
        ? message 
        : JSON.stringify(message);
        
      webSocketRef.current.send(messageStr);
    } catch (err) {
      console.error('Error sending WebSocket message:', err);
    }
  }, []);
  
  // Connect when the component mounts (unless manualOpen is true)
  useEffect(() => {
    if (!options.manualOpen) {
      connect();
    }
    
    // Clean up when the component unmounts
    return cleanup;
  }, [connect, cleanup, options.manualOpen]);
  
  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    connect,
    disconnect,
    connectionCount
  };
}