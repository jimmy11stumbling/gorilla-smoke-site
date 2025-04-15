import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import compression from "compression";
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

  return httpServer;
}
