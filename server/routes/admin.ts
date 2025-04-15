import type { Express, Request, Response } from "express";
import { generateSitemap } from "../sitemap";

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
}