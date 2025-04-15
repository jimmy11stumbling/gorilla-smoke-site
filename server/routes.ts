import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import compression from "compression";
import { WebSocketServer, WebSocket } from "ws";
import { generateSitemap } from "./sitemap";

// Import middleware
import { setupSecurityMiddleware, featurePolicyMiddleware, cacheControlMiddleware, http2ServerPushMiddleware } from "./middleware/security";
import { imageProcessingMiddleware } from "./middleware/imageProcessing";

// Import route modules
import { registerAllRoutes } from "./routes/index";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply middleware for compression and security
  app.use(compression()); // Compress all responses
  
  // Apply security middleware
  app.use(setupSecurityMiddleware);
  app.use(featurePolicyMiddleware);
  app.use(cacheControlMiddleware);
  app.use(http2ServerPushMiddleware);
  
  // Add image processing middleware
  app.use(imageProcessingMiddleware);
  
  // Generate sitemap on startup
  try {
    await generateSitemap();
    console.log('Sitemap generated successfully on startup');
  } catch (error) {
    console.error('Error generating sitemap on startup:', error);
  }
  
  // Register all API and static routes
  registerAllRoutes(app);

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server on a different path than Vite's HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Set of connected clients
  const clients = new Set<WebSocket>();
  
  // WebSocket server event handlers
  wss.on('connection', (ws) => {
    // Add new client to the set
    clients.add(ws);
    console.log('WebSocket client connected, total clients:', clients.size);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Gorilla Smoke & Grill real-time server'
    }));
    
    // Handle messages from clients
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          
          // Broadcasting messages to kitchen displays or admin panels would happen here
          case 'admin_broadcast':
            if (data.role === 'admin' || data.role === 'kitchen') {
              broadcastMessage(data.message);
            }
            break;
            
          default:
            // Echo back unknown message types for debugging
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Unknown message type', 
              original: data 
            }));
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Failed to process message' 
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected, remaining clients:', clients.size);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
  
  // Broadcast a message to all connected clients
  function broadcastMessage(message: any) {
    const messageStr = typeof message === 'string' 
      ? message 
      : JSON.stringify(message);
      
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
  
  // Add broadcastMessage to the global scope for use in other routes
  (global as any).broadcastOrderUpdate = (orderId: number, status: string) => {
    broadcastMessage({
      type: 'order_update',
      orderId,
      status,
      timestamp: Date.now()
    });
  };

  return httpServer;
}
