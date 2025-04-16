import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { contactSchema, orderSchema, orderItemSchema, leadSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { generateSitemap } from "./sitemap";
import path from "path";
import { imageOptimizer } from "./routes/imageOptimizer";
import compression from "compression";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply middleware for performance optimization
  
  // Enable compression for all responses
  app.use(compression({
    level: 6, // Balanced compression level (0-9)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      // Don't compress responses with Content-Type containing "image"
      const contentType = res.getHeader('Content-Type');
      if (contentType && String(contentType).includes('image')) {
        return false;
      }
      // Use compression for all other requests
      return compression.filter(req, res);
    }
  }));
  
  // Apply image optimization middleware
  app.use(imageOptimizer);
  
  // Set cache headers for static assets
  app.use((req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    
    // Cache static assets for 1 day
    if (path.match(/\.(css|js|svg|ttf|woff2|jpg|jpeg|png|webp|gif)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    
    next();
  });
  
  // Generate sitemap on startup
  try {
    await generateSitemap();
    console.log('Sitemap generated successfully on startup');
  } catch (error) {
    console.error('Error generating sitemap on startup:', error);
  }
  
  // Serve robots.txt and sitemap.xml from public folder
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });
  
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });
  
  app.get('/humans.txt', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'humans.txt'));
    res.set('Content-Type', 'text/plain');
  });
  
  app.get('/.well-known/security.txt', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', '.well-known', 'security.txt'));
    res.set('Content-Type', 'text/plain');
  });
  
  app.get('/structured-data.json', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'structured-data.json'));
  });
  
  app.get('/manifest.json', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
  });
  
  app.get('/service-worker.js', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'service-worker.js'));
    res.set('Content-Type', 'application/javascript');
    res.set('Service-Worker-Allowed', '/');
  });
  
  // Serve icon files
  app.get('/icons/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'public', 'icons', filename);
    
    // Set appropriate content type based on file extension
    if (filename.endsWith('.svg')) {
      res.set('Content-Type', 'image/svg+xml');
    } else if (filename.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
    
    res.sendFile(filePath);
  });
  
  // API endpoint to regenerate sitemap
  app.post('/api/admin/regenerate-sitemap', async (_req: Request, res: Response) => {
    try {
      await generateSitemap();
      return res.status(200).json({
        success: true,
        message: 'Sitemap regenerated successfully',
      });
    } catch (error) {
      console.error('Error regenerating sitemap:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while regenerating the sitemap',
      });
    }
  });
  // Contact form submission endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = contactSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const contact = result.data;
      
      // Store contact form submission
      const savedContact = await storage.createContactSubmission(contact);
      
      return res.status(200).json({
        success: true,
        message: "Contact form submitted successfully",
        data: savedContact,
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while submitting the contact form",
      });
    }
  });

  // Menu items endpoints
  app.get("/api/menu", async (_req: Request, res: Response) => {
    try {
      const menuItems = await storage.getMenuItems();
      return res.status(200).json({
        success: true,
        data: menuItems,
      });
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching menu items",
      });
    }
  });

  app.get("/api/menu/featured", async (_req: Request, res: Response) => {
    try {
      const featuredItems = await storage.getFeaturedItems();
      return res.status(200).json({
        success: true,
        data: featuredItems,
      });
    } catch (error) {
      console.error("Error fetching featured items:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching featured items",
      });
    }
  });

  app.get("/api/menu/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(category);
      return res.status(200).json({
        success: true,
        data: menuItems,
      });
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching menu items by category",
      });
    }
  });

  app.get("/api/menu/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item ID",
        });
      }
      
      const menuItem = await storage.getMenuItem(id);
      
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        data: menuItem,
      });
    } catch (error) {
      console.error("Error fetching menu item:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching menu item",
      });
    }
  });

  // Note: Order endpoints have been removed as we now exclusively use third-party delivery services
  // All ordering functionality is handled through UberEats, DoorDash, and Grubhub
  
  // Delivery service link endpoints
  app.get("/api/delivery-services", (_req: Request, res: Response) => {
    // This endpoint returns the available delivery services and their base URLs
    return res.status(200).json({
      success: true,
      data: {
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill",
        doordash: "https://www.doordash.com/store/gorilla-smoke-grill",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill"
      }
    });
  });
  
  // Get location-specific delivery links
  app.get("/api/delivery-services/:location", (req: Request, res: Response) => {
    const { location } = req.params;
    const validLocations = ['delmar', 'zapata', 'sanbernardo'];
    
    if (!validLocations.includes(location)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location. Valid options are: delmar, zapata, sanbernardo"
      });
    }
    
    // Location-specific delivery service URLs
    const deliveryUrls = {
      delmar: {
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill-del-mar",
        doordash: "https://www.doordash.com/store/gorilla-smoke-grill-del-mar-laredo-23760291/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill-del-mar-3910-e-del-mar-ave-laredo"
      },
      zapata: {
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill-zapata",
        doordash: "https://www.doordash.com/store/gorilla-smoke-grill-zapata-laredo-24582104/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill-zapata-608-zapata-hwy-laredo"
      },
      sanbernardo: {
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill-san-bernardo",
        doordash: "https://www.doordash.com/store/gorilla-smoke-grill-san-bernardo-laredo-24789216/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill-san-bernardo-3301-san-bernardo-ave-laredo"
      }
    };
    
    return res.status(200).json({
      success: true,
      data: deliveryUrls[location as keyof typeof deliveryUrls]
    });
  });
  
  // Lead management endpoints
  
  // Create a new lead
  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = leadSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const leadData = result.data;
      
      // Check if this email already exists
      const existingLead = await storage.getLeadByEmail(leadData.email);
      let lead;
      
      if (existingLead) {
        // For existing leads, we'll just use the existing record
        // But could update certain fields here if needed
        lead = existingLead;
      } else {
        // Create new lead record
        lead = await storage.createLead({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          marketingConsent: leadData.marketingConsent,
          locationId: leadData.locationId,
          source: leadData.source || 'website',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Lead information saved successfully",
        data: lead,
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while saving lead information",
      });
    }
  });
  
  // Track which delivery service was selected
  app.post("/api/leads/track-service", async (req: Request, res: Response) => {
    try {
      const { leadId, service, locationId } = req.body;
      
      // Validate required fields
      if (!service) {
        return res.status(400).json({
          success: false,
          message: "Service name is required",
        });
      }
      
      // If leadId is provided, we'll use it directly
      // Otherwise, we'll attempt to find the most recent lead from this location
      let trackingResult;
      
      if (leadId) {
        // Use the provided lead ID
        trackingResult = await storage.trackLeadServiceSelection(leadId, service);
      } else if (locationId) {
        // Find the most recent lead from this location
        const locationLeads = await storage.getLeadsByLocation(locationId);
        
        if (locationLeads && locationLeads.length > 0) {
          // Use the most recent lead
          trackingResult = await storage.trackLeadServiceSelection(locationLeads[0].id, service);
        } else {
          return res.status(404).json({
            success: false,
            message: "No leads found for this location",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Either leadId or locationId is required",
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Service selection tracked successfully",
        data: trackingResult,
      });
    } catch (error) {
      console.error("Error tracking service selection:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while tracking service selection",
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });
  
  // Store connected clients with a maximum limit
  const clients = new Set<WebSocket>();
  const MAX_CONNECTIONS = 10;
  
  // WebSocket event handlers
  wss.on('connection', (ws) => {
    // Check connection limit
    if (clients.size >= MAX_CONNECTIONS) {
      console.log('Connection limit reached, rejecting new connection');
      ws.close(1013, 'Maximum connection limit reached');
      return;
    }
    
    // Add client to the set
    clients.add(ws);
    console.log('WebSocket client connected. Total connections:', clients.size);
    
    // Send a welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Gorilla Smoke & Grill WebSocket Server'
    }));
    
    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          case 'location_update':
            // Broadcast location updates to all clients
            broadcastMessage({
              type: 'location_update',
              locationId: data.locationId,
              event: data.event,
              timestamp: Date.now()
            });
            break;
          case 'order_notification':
            // Broadcast order notifications to all clients
            broadcastMessage({
              type: 'order_notification',
              orderId: data.orderId,
              locationId: data.locationId,
              service: data.service,
              customerName: data.customerName,
              status: data.status,
              timestamp: Date.now()
            });
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected. Remaining connections:', clients.size);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
  
  // Function to broadcast messages to all connected clients
  function broadcastMessage(message: any) {
    const messageString = JSON.stringify(message);
    
    clients.forEach(client => {
      // Check if the connection is still open
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }
  
  // Also expose the broadcast function to be used in other parts of the application
  (httpServer as any).broadcastToWebSocketClients = broadcastMessage;
  
  // Example of how to broadcast a message from another part of the application:
  // httpServer.broadcastToWebSocketClients({
  //   type: 'location_update',
  //   locationId: 'delmar',
  //   event: 'special_event',
  //   message: 'New limited-time menu available at Del Mar location!'
  // });

  return httpServer;
}
