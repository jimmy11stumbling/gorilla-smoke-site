import type { Express, Request, Response } from "express";
import { storage } from "../storage";

export function registerMenuRoutes(app: Express): void {
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
}