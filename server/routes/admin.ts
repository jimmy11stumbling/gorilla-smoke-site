import type { Express, Request, Response } from "express";
import { generateSitemap } from "../sitemap";
import { storage } from "../storage";

export function registerAdminRoutes(app: Express): void {
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

  // API endpoint to get all orders for staff/admin view
  app.get('/api/staff/orders', async (_req: Request, res: Response) => {
    try {
      // In a real application, we would implement authentication/authorization here
      // to ensure only staff members can access this endpoint
      
      // For now, we'll fetch all orders from storage
      const orders = await storage.getAllOrders();
      
      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching orders',
      });
    }
  });
  
  // API endpoint to send a notification to all connected clients
  app.post('/api/staff/notify', async (req: Request, res: Response) => {
    try {
      // In a real application, we would implement authentication/authorization here
      
      const { type, message } = req.body;
      
      if (!type || !message) {
        return res.status(400).json({
          success: false,
          message: 'Both type and message are required',
        });
      }
      
      // Use the global broadcast function if available
      if (typeof (global as any).broadcastMessage === 'function') {
        (global as any).broadcastMessage({
          type,
          message,
          timestamp: Date.now(),
        });
        
        return res.status(200).json({
          success: true,
          message: 'Notification sent successfully',
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'WebSocket broadcast functionality is not available',
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while sending the notification',
      });
    }
  });
}