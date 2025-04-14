import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, orderSchema, orderItemSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { generateSitemap } from "./sitemap";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Order endpoints
  // Create a new order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      // Define a schema for the order request
      const orderItemWithoutOrderId = orderItemSchema.omit({ orderId: true });
      
      const orderRequestSchema = z.object({
        order: orderSchema,
        items: z.array(orderItemWithoutOrderId)
      });
      
      // Validate request body
      const result = orderRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const { order, items } = result.data;
      
      // Create the order with items
      // The orderId will be added inside the createOrder method
      const savedOrder = await storage.createOrder(
        order, 
        items as any // Using a type assertion since we'll add orderId in the createOrder method
      );
      
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: savedOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the order",
      });
    }
  });

  // Get order details with items
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }
      
      const order = await storage.getOrderWithItems(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching the order",
      });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }
      
      // Validate status
      const statusSchema = z.object({
        status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
      });
      
      const result = statusSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const { status } = result.data;
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the order status",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
