import { useState, useEffect, useCallback, useRef } from 'react';

// WebSocket message interface for better type safety
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// Handler type for message callbacks
export type MessageHandler = (data: WebSocketMessage) => void;

// Client role types matching server roles
export type ClientRole = 'customer' | 'kitchen' | 'admin' | 'unknown';

// Hook configuration options
export interface WebSocketHookOptions {
  role?: ClientRole;
  onOpen?: (event: Event, clientId: string) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Error) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  manualOpen?: boolean;
  debug?: boolean;
}

// Hook return value interface
export interface WebSocketHookReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  clientId: string | null;
  clientRole: ClientRole;
  sendMessage: (message: WebSocketMessage) => boolean;
  sendPing: () => void;
  connect: () => void;
  disconnect: () => void;
  connectionCount: number;
  lastActivity: number;
}

/**
 * Enhanced hook to connect to the WebSocket server with improved error handling,
 * role-based authentication, and automatic reconnection.
 */
export function useWebSocket(
  handlers: Record<string, MessageHandler> = {},
  options: WebSocketHookOptions = {}
): WebSocketHookReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientRole, setClientRole] = useState<ClientRole>(options.role || 'unknown');
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const handlersRef = useRef(handlers);
  const pingIntervalRef = useRef<number | null>(null);
  
  // Logger function that respects debug mode
  const log = useCallback((message: string, ...args: any[]) => {
    if (options.debug) {
      console.log(`[WebSocket] ${message}`, ...args);
    }
  }, [options.debug]);
  
  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);
  
  // Update client role when options.role changes
  useEffect(() => {
    if (options.role && options.role !== clientRole) {
      setClientRole(options.role);
      
      // If already connected, send registration update
      if (isConnected && webSocketRef.current?.readyState === WebSocket.OPEN) {
        try {
          webSocketRef.current.send(JSON.stringify({
            type: 'register',
            role: options.role
          }));
        } catch (err) {
          log('Error sending role update', err);
        }
      }
    }
  }, [options.role, clientRole, isConnected, log]);
  
  // Cleanup connection and timers
  const cleanup = useCallback(() => {
    // Clear reconnection timeout
    if (reconnectTimeoutRef.current !== null) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Clear ping interval
    if (pingIntervalRef.current !== null) {
      window.clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    // Close and clean up WebSocket connection
    if (webSocketRef.current) {
      // Remove all event listeners to prevent memory leaks
      webSocketRef.current.onopen = null;
      webSocketRef.current.onclose = null;
      webSocketRef.current.onmessage = null;
      webSocketRef.current.onerror = null;
      
      // Close the connection if it's still open
      if (webSocketRef.current.readyState === WebSocket.OPEN || 
          webSocketRef.current.readyState === WebSocket.CONNECTING) {
        try {
          webSocketRef.current.close(1000, 'Client disconnecting');
        } catch (err) {
          log('Error closing WebSocket connection', err);
        }
      }
      
      webSocketRef.current = null;
    }
    
    // Reset state
    setIsConnected(false);
    setIsConnecting(false);
  }, [log]);
  
  // Send a message to the server with error handling
  const sendMessage = useCallback((message: WebSocketMessage): boolean => {
    if (!webSocketRef.current || webSocketRef.current.readyState !== WebSocket.OPEN) {
      log('Cannot send message, WebSocket is not connected');
      return false;
    }
    
    try {
      webSocketRef.current.send(JSON.stringify(message));
      setLastActivity(Date.now());
      return true;
    } catch (err) {
      log('Error sending WebSocket message', err);
      return false;
    }
  }, [log]);
  
  // Convenience method to send a ping
  const sendPing = useCallback(() => {
    sendMessage({ 
      type: 'ping', 
      timestamp: Date.now() 
    });
  }, [sendMessage]);
  
  // Start periodic pings to keep connection alive
  const startPingInterval = useCallback(() => {
    // Clear any existing interval
    if (pingIntervalRef.current !== null) {
      window.clearInterval(pingIntervalRef.current);
    }
    
    // Start a new interval
    pingIntervalRef.current = window.setInterval(() => {
      sendPing();
    }, 30000); // Every 30 seconds
  }, [sendPing]);
  
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
    
    // Update connection state
    setIsConnecting(true);
    setError(null);
    
    try {
      // Determine the WebSocket URL based on the current protocol and host
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      log(`Connecting to WebSocket server at ${wsUrl}`);
      
      // Create a new WebSocket connection
      const socket = new WebSocket(wsUrl);
      webSocketRef.current = socket;
      
      // Handle connection open
      socket.onopen = (event) => {
        log('WebSocket connection opened');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionCount(prev => prev + 1);
        reconnectAttemptsRef.current = 0;
        setLastActivity(Date.now());
        
        // Start ping interval
        startPingInterval();
        
        // Register client role if specified
        if (clientRole !== 'unknown') {
          sendMessage({
            type: 'register',
            role: clientRole
          });
        }
        
        // Call the onOpen callback if provided
        if (options.onOpen && clientId) {
          options.onOpen(event, clientId);
        }
      };
      
      // Handle incoming messages
      socket.onmessage = (event) => {
        try {
          // Parse the message data as JSON
          const data = JSON.parse(event.data) as WebSocketMessage;
          setLastActivity(Date.now());
          
          log('Received WebSocket message', data);
          
          // Handle special message types
          if (data.type === 'connection' && data.clientId) {
            setClientId(data.clientId);
            
            // If we have a role but just got our client ID, register now
            if (clientRole !== 'unknown') {
              sendMessage({
                type: 'register',
                role: clientRole
              });
            }
          } else if (data.type === 'register_confirmed' && data.role) {
            setClientRole(data.role as ClientRole);
          } else if (data.type === 'server_ping') {
            // Respond to server pings
            sendMessage({ 
              type: 'pong', 
              timestamp: Date.now(),
              serverTimestamp: data.timestamp
            });
          }
          
          // Call the appropriate message handler
          if (data.type && handlersRef.current[data.type]) {
            handlersRef.current[data.type](data);
          } else if (handlersRef.current['*']) {
            // Call the catch-all handler if available
            handlersRef.current['*'](data);
          }
        } catch (err) {
          log('Error processing WebSocket message', err);
        }
      };
      
      // Handle connection close
      socket.onclose = (event) => {
        log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        setIsConnected(false);
        setIsConnecting(false);
        
        // Call the onClose callback if provided
        if (options.onClose) {
          options.onClose(event);
        }
        
        // Clear ping interval
        if (pingIntervalRef.current !== null) {
          window.clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        // Attempt to reconnect if:
        // 1. Not closed cleanly (abnormal closure)
        // 2. We haven't exceeded max reconnect attempts
        // 3. The close wasn't initiated by the client (code 1000)
        const maxAttempts = options.reconnectAttempts ?? 5;
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxAttempts) {
          // Exponential backoff for reconnection attempts
          const baseInterval = options.reconnectInterval ?? 1000;
          const reconnectInterval = baseInterval * Math.pow(1.5, reconnectAttemptsRef.current);
          
          log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1}/${maxAttempts} in ${reconnectInterval}ms`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxAttempts) {
          log('Maximum reconnection attempts reached');
          setError(new Error(`Failed to reconnect after ${maxAttempts} attempts`));
        }
      };
      
      // Handle connection errors
      socket.onerror = (event) => {
        const connectionError = new Error('WebSocket connection error');
        log('WebSocket connection error', event);
        setError(connectionError);
        setIsConnecting(false);
        
        // Call the onError callback if provided
        if (options.onError) {
          options.onError(connectionError);
        }
      };
    } catch (err) {
      const connectionError = err instanceof Error ? err : new Error('Failed to connect to WebSocket server');
      log('Error creating WebSocket connection', err);
      setIsConnecting(false);
      setError(connectionError);
      
      // Call the onError callback if provided
      if (options.onError) {
        options.onError(connectionError);
      }
    }
  }, [isConnecting, cleanup, clientRole, clientId, options.onOpen, options.onClose, options.onError, options.reconnectAttempts, options.reconnectInterval, log, sendMessage, startPingInterval]);
  
  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    log('Disconnecting from WebSocket server');
    cleanup();
  }, [cleanup, log]);
  
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
    clientId,
    clientRole,
    sendMessage,
    sendPing,
    connect,
    disconnect,
    connectionCount,
    lastActivity
  };
}