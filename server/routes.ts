import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import compression from "compression";
import { generateSitemap } from "./sitemap";
import { initializeWebSocketServer } from "./websocket";
import { log } from "./vite";

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
    log('Sitemap generated successfully on startup', 'express');
  } catch (error) {
    log(`Error generating sitemap on startup: ${error}`, 'express');
  }
  
  // Register all API and static routes
  registerAllRoutes(app);

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Initialize WebSocket server with improved error handling and client tracking
  initializeWebSocketServer(httpServer);
  
  return httpServer;
}
