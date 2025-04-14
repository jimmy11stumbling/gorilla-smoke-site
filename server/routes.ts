import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);

  return httpServer;
}
