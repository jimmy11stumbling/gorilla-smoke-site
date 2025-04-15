import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { log } from './vite';

// Define message types for better type safety
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// Define client types for user roles
type ClientRole = 'customer' | 'kitchen' | 'admin' | 'unknown';

// Track client information
interface ConnectedClient {
  ws: WebSocket;
  id: string;
  role: ClientRole;
  lastPing: number;
}

// WebSocket manager class with improved error handling and client tracking
export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts: Map<string, number> = new Map();
  
  constructor(server: HttpServer, path: string = '/ws') {
    this.wss = new WebSocketServer({ server, path });
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start the ping interval to keep connections alive
    this.startPingInterval();
    
    log('WebSocket server initialized', 'websocket');
  }
  
  private setupEventListeners(): void {
    this.wss.on('connection', (ws, req) => {
      try {
        // Generate a unique client ID
        const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Store client information
        this.clients.set(clientId, {
          ws,
          id: clientId,
          role: 'unknown', // Default role until authenticated
          lastPing: Date.now()
        });
        
        log(`WebSocket client connected: ${clientId}, total clients: ${this.clients.size}`, 'websocket');
        
        // Send welcome message
        this.sendToClient(ws, {
          type: 'connection',
          message: 'Connected to Gorilla Smoke & Grill real-time server',
          clientId
        });
        
        // Set up client event listeners
        this.setupClientEventListeners(ws, clientId);
        
        // Reset reconnect attempts for this client
        this.reconnectAttempts.delete(clientId);
      } catch (error) {
        log(`Error handling WebSocket connection: ${error}`, 'websocket');
        ws.terminate();
      }
    });
    
    // Handle server-wide errors
    this.wss.on('error', (error) => {
      log(`WebSocket server error: ${error}`, 'websocket');
    });
    
    // Handle server close
    this.wss.on('close', () => {
      log('WebSocket server closed', 'websocket');
      this.stopPingInterval();
    });
  }
  
  private setupClientEventListeners(ws: WebSocket, clientId: string): void {
    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString()) as WebSocketMessage;
        log(`Received message from ${clientId}: ${data.type}`, 'websocket');
        
        // Update last ping time
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = Date.now();
          
          // Handle role registration if provided
          if (data.type === 'register' && data.role) {
            client.role = this.validateRole(data.role);
            this.sendToClient(ws, {
              type: 'register_confirmed',
              role: client.role
            });
            log(`Client ${clientId} registered as ${client.role}`, 'websocket');
          }
        }
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            this.sendToClient(ws, { type: 'pong', timestamp: Date.now() });
            break;
          
          case 'status_request':
            // Only allow status requests from admin or kitchen roles
            if (client && (client.role === 'admin' || client.role === 'kitchen')) {
              this.sendServerStatus(ws);
            } else {
              this.sendToClient(ws, { 
                type: 'error', 
                message: 'Unauthorized: Only admin or kitchen can request server status'
              });
            }
            break;
            
          case 'broadcast':
            // Only allow broadcasts from admin or kitchen roles
            if (client && (client.role === 'admin' || client.role === 'kitchen')) {
              this.broadcast(data);
            } else {
              this.sendToClient(ws, { 
                type: 'error', 
                message: 'Unauthorized: Only admin or kitchen can broadcast messages'
              });
            }
            break;
            
          case 'direct':
            // Handle direct messages to specific clients
            if (data.targetId && this.clients.has(data.targetId)) {
              const targetClient = this.clients.get(data.targetId);
              if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
                this.sendToClient(targetClient.ws, {
                  ...data.payload,
                  sourceId: clientId
                });
              }
            }
            break;
            
          default:
            // Echo back unknown message types for debugging
            this.sendToClient(ws, {
              type: 'unhandled_message',
              originalType: data.type
            });
        }
      } catch (error) {
        log(`Error processing WebSocket message: ${error}`, 'websocket');
        this.sendToClient(ws, {
          type: 'error',
          message: 'Failed to process message - invalid format'
        });
      }
    });
    
    // Handle disconnection
    ws.on('close', (code, reason) => {
      this.clients.delete(clientId);
      log(`WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason.toString()}, remaining: ${this.clients.size}`, 'websocket');
    });
    
    // Handle client errors
    ws.on('error', (error) => {
      log(`WebSocket client error for ${clientId}: ${error}`, 'websocket');
      try {
        ws.terminate();
      } catch (error) {
        // Ignore errors during termination
      } finally {
        this.clients.delete(clientId);
      }
    });
  }
  
  // Validate and sanitize role input
  private validateRole(role: string): ClientRole {
    const validRoles: ClientRole[] = ['customer', 'kitchen', 'admin'];
    return validRoles.includes(role as ClientRole) ? (role as ClientRole) : 'unknown';
  }
  
  // Ping clients to keep connections alive and detect stale connections
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      const staleTimeout = 60000; // 60 seconds
      
      this.clients.forEach((client, id) => {
        try {
          // Check if client is stale
          if (now - client.lastPing > staleTimeout) {
            log(`Terminating stale connection: ${id}`, 'websocket');
            client.ws.terminate();
            this.clients.delete(id);
            return;
          }
          
          // Send ping if connection is open
          if (client.ws.readyState === WebSocket.OPEN) {
            this.sendToClient(client.ws, { type: 'server_ping', timestamp: now });
          }
        } catch (error) {
          log(`Error in ping interval for client ${id}: ${error}`, 'websocket');
          this.clients.delete(id);
        }
      });
    }, 30000); // Every 30 seconds
  }
  
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
  
  // Send message to a specific client with error handling
  public sendToClient(ws: WebSocket, message: WebSocketMessage): boolean {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        return true;
      }
      return false;
    } catch (error) {
      log(`Error sending message to client: ${error}`, 'websocket');
      return false;
    }
  }
  
  // Broadcast message to all clients with filtering options
  public broadcast(message: WebSocketMessage, filter?: { roles?: ClientRole[], excludeIds?: string[] }): number {
    let sentCount = 0;
    
    this.clients.forEach((client) => {
      // Skip if client role doesn't match filter
      if (filter?.roles && !filter.roles.includes(client.role)) {
        return;
      }
      
      // Skip if client ID is in exclude list
      if (filter?.excludeIds && filter.excludeIds.includes(client.id)) {
        return;
      }
      
      // Send message if client is connected
      if (this.sendToClient(client.ws, message)) {
        sentCount++;
      }
    });
    
    return sentCount;
  }
  
  // Broadcast order updates to interested clients
  public broadcastOrderUpdate(orderId: number, status: string, details?: any): void {
    const message: WebSocketMessage = {
      type: 'order_update',
      orderId,
      status,
      timestamp: Date.now(),
      ...(details && { details })
    };
    
    // Send to all kitchen staff and admins
    this.broadcast(message, { roles: ['kitchen', 'admin'] });
    
    // For customer notifications like "ready" status, we would need to track which
    // customer placed which order. For simplicity, we're broadcasting to all customers here.
    if (['confirmed', 'ready'].includes(status)) {
      this.broadcast(message, { roles: ['customer'] });
    }
  }
  
  // Get count of connected clients, optionally filtered by role
  public getClientCount(role?: ClientRole): number {
    if (!role) {
      return this.clients.size;
    }
    
    return Array.from(this.clients.values()).filter(client => client.role === role).length;
  }
  
  // Send server status to a client
  public sendServerStatus(ws: WebSocket): boolean {
    // Get server start time
    const now = Date.now();
    const serverStartTime = new Date(now - process.uptime() * 1000);
    
    // Gather client role counts
    const clientCounts = {
      total: this.clients.size,
      customers: this.getClientCount('customer'),
      kitchen: this.getClientCount('kitchen'),
      admin: this.getClientCount('admin'),
      unknown: this.getClientCount('unknown')
    };
    
    // Create status message
    const statusMessage: WebSocketMessage = {
      type: 'status_update',
      clients: clientCounts,
      server: {
        uptime: Math.floor(process.uptime()),
        started: serverStartTime.toISOString(),
        status: 'online'
      },
      timestamp: now
    };
    
    return this.sendToClient(ws, statusMessage);
  }
  
  // Clean shutdown
  public shutdown(): void {
    this.stopPingInterval();
    
    // Close all client connections gracefully
    this.clients.forEach((client) => {
      try {
        client.ws.close(1000, 'Server shutting down');
      } catch (error) {
        // Ignore errors during shutdown
      }
    });
    
    // Clear clients
    this.clients.clear();
    
    // Close the server
    this.wss.close();
    
    log('WebSocket server shut down', 'websocket');
  }
}

// Singleton instance
let wsManager: WebSocketManager | null = null;

// Initialize WebSocket server
export function initializeWebSocketServer(server: HttpServer): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(server);
    
    // Make broadcast methods available globally
    (global as any).broadcastOrderUpdate = (orderId: number, status: string, details?: any) => {
      wsManager?.broadcastOrderUpdate(orderId, status, details);
    };
    
    (global as any).broadcastMessage = (message: WebSocketMessage) => {
      wsManager?.broadcast(message);
    };
  }
  
  return wsManager;
}

// Get the WebSocket manager instance
export function getWebSocketManager(): WebSocketManager | null {
  return wsManager;
}