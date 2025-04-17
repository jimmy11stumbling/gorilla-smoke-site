import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { contactSchema, orderSchema, orderItemSchema, leadSchema, insertUserSchema, menuItemSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { generateSitemap } from "./sitemap";
import path from "path";
import { imageOptimizer } from "./routes/imageOptimizer";
import compression from "compression";
import passport from 'passport';
import { isAuthenticated, isAdmin, isAdminOrManager, isStaff } from './auth';
import bcrypt from 'bcrypt';

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
  
  // Serve standalone admin panel
  app.get('/admin-standalone', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'admin.html'));
  });
  
  app.get('/menu-standalone', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'menu-standalone.html'));
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
  
  // SEO Monitoring endpoint
  app.post("/api/seo/monitor", (req: Request, res: Response) => {
    try {
      // Log SEO monitoring data for analysis
      // In a production environment, this would save the data to a database
      // or send it to a monitoring service
      const timestamp = new Date().toISOString();
      const seoData = req.body;
      const clientIP = req.ip || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      
      console.log(`[SEO Monitor][${timestamp}] Data received from ${clientIP} (${userAgent})`);
      
      // Log critical SEO issues
      const criticalIssues: string[] = [];
      
      if (seoData.checks?.metaTags?.title === false) {
        criticalIssues.push('Missing page title');
      }
      
      if (seoData.checks?.metaTags?.description === false) {
        criticalIssues.push('Missing meta description');
      }
      
      if (seoData.checks?.structuredData === false) {
        criticalIssues.push('Missing structured data');
      }
      
      if (seoData.checks?.images?.altPercentage < 80) {
        criticalIssues.push(`Only ${seoData.checks.images.altPercentage}% of images have alt text`);
      }
      
      if (criticalIssues.length > 0) {
        console.log(`[SEO Monitor][${timestamp}] Critical issues found on ${seoData.url}:`, criticalIssues);
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Error processing SEO monitoring data:", error);
      return res.status(500).json({ success: false, message: "Failed to process SEO data" });
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
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-south-zapata/aWqP3znNXFWWHp5xXNMywA",
        doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-608-south-zapata-highway-laredo/4937816"
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
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-del-mar/MPdV3bWsSQqCxZ2iX9WyXw",
        doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-3910-e-del-mar-laredo/7821651"
      },
      zapata: {
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-south-zapata/aWqP3znNXFWWHp5xXNMywA",
        doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-608-south-zapata-highway-laredo/4937816"
      },
      sanbernardo: {
        ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-san-bernardo/SDwW2e1LSWOUcVxAB9gJdQ",
        doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
        grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-3301-san-bernardo-ave-laredo/6214532"
      }
    };
    
    return res.status(200).json({
      success: true,
      data: deliveryUrls[location as keyof typeof deliveryUrls]
    });
  });
  
  // Authentication routes
  // Login route
  app.post('/api/auth/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info.message || 'Authentication failed',
        });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Return user info (excluding password)
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json({
          success: true,
          message: 'Authentication successful',
          user: userWithoutPassword,
        });
      });
    })(req, res, next);
  });
  
  // Logout route
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error during logout',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
  
  // Get current user
  app.get('/api/auth/user', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = req.user as any;
    
    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  });
  
  // Admin: User management routes
  // Get all users (admin only)
  app.get('/api/admin/users', isAdmin, async (_req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords from the response
      const sanitizedUsers = users.map(({ password, ...rest }) => rest);
      
      return res.status(200).json({
        success: true,
        data: sanitizedUsers,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching users',
      });
    }
  });
  
  // Create new user (admin only)
  const userCreationSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['admin', 'manager', 'staff']),
  });
  
  app.post('/api/admin/users', isAdmin, async (req: Request, res: Response) => {
    try {
      // Validate request
      const result = userCreationSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const userData = result.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists',
        });
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the user',
      });
    }
  });
  
  // Update user (admin only)
  const userUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(['admin', 'manager', 'staff']).optional(),
  });
  
  app.put('/api/admin/users/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
      }
      
      // Validate request
      const result = userUpdateSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const updateData = { ...result.data };
      
      // If password is being updated, hash it
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the user',
      });
    }
  });
  
  // Delete user (admin only)
  app.delete('/api/admin/users/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      // Delete user
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete user',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the user',
      });
    }
  });
  
  // Admin: Menu management routes
  // Create menu item (admin or manager only)
  app.post('/api/admin/menu', isAdminOrManager, async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = menuItemSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const menuItemData = result.data;
      
      // Create menu item
      const menuItem = await storage.createMenuItem(menuItemData);
      
      return res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: menuItem,
      });
    } catch (error) {
      console.error('Error creating menu item:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating the menu item',
      });
    }
  });
  
  // Update menu item (admin or manager only)
  app.put('/api/admin/menu/:id', isAdminOrManager, async (req: Request, res: Response) => {
    try {
      const menuItemId = parseInt(req.params.id);
      if (isNaN(menuItemId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid menu item ID',
        });
      }
      
      // Check if menu item exists
      const existingMenuItem = await storage.getMenuItem(menuItemId);
      if (!existingMenuItem) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found',
        });
      }
      
      // Validate request body (partial validation)
      const partialMenuItemSchema = menuItemSchema.partial();
      const result = partialMenuItemSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      const menuItemData = result.data;
      
      // Update menu item
      const updatedMenuItem = await storage.updateMenuItem(menuItemId, menuItemData);
      
      return res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        data: updatedMenuItem,
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the menu item',
      });
    }
  });
  
  // Delete menu item (admin or manager only)
  app.delete('/api/admin/menu/:id', isAdminOrManager, async (req: Request, res: Response) => {
    try {
      const menuItemId = parseInt(req.params.id);
      if (isNaN(menuItemId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid menu item ID',
        });
      }
      
      // Check if menu item exists
      const menuItem = await storage.getMenuItem(menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: 'Menu item not found',
        });
      }
      
      // Delete menu item
      const success = await storage.deleteMenuItem(menuItemId);
      
      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete menu item',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the menu item',
      });
    }
  });
  
  // Admin: Lead management routes
  // Get all leads (admin or manager only)
  app.get('/api/admin/leads', isAdminOrManager, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const leads = await storage.getAllLeads(limit, offset);
      
      return res.status(200).json({
        success: true,
        data: leads,
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching leads',
      });
    }
  });
  
  // Get lead by ID (admin or manager only)
  app.get('/api/admin/leads/:id', isAdminOrManager, async (req: Request, res: Response) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid lead ID',
        });
      }
      
      const lead = await storage.getLead(leadId);
      
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }
      
      return res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      console.error('Error fetching lead:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the lead',
      });
    }
  });
  
  // Get service selection statistics (admin or manager only)
  app.get('/api/admin/leads/stats/services', isAdminOrManager, async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getServiceSelectionCounts();
      
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching service selection statistics:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching service selection statistics',
      });
    }
  });
  
  // Admin: Contact form submissions management
  // Get all contact form submissions (admin or manager only)
  app.get('/api/admin/contacts', isAdminOrManager, async (_req: Request, res: Response) => {
    try {
      const submissions = await storage.getContactSubmissions();
      
      return res.status(200).json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      console.error('Error fetching contact form submissions:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching contact form submissions',
      });
    }
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
  
  // Store connected clients with connection timestamp to track age
  interface TimestampedClient {
    client: WebSocket;
    timestamp: number;
  }
  
  const clients: TimestampedClient[] = [];
  const MAX_CONNECTIONS = 50; // Reduced connection limit
  
  // Set up periodic cleanup every 15 seconds
  setInterval(() => {
    cleanupConnections();
  }, 15000);
  
  // Clean up dead connections
  function cleanupConnections() {
    const initialCount = clients.length;
    
    // First, remove closed/closing connections
    for (let i = clients.length - 1; i >= 0; i--) {
      const { client } = clients[i];
      if (client.readyState === WebSocket.CLOSED || client.readyState === WebSocket.CLOSING) {
        clients.splice(i, 1);
      }
    }
    
    // If we're still over the limit, remove oldest connections
    if (clients.length > MAX_CONNECTIONS * 0.9) { // Start cleaning at 90% capacity
      // Sort by timestamp (oldest first)
      clients.sort((a, b) => a.timestamp - b.timestamp);
      
      // Calculate how many to remove (keep 80% of max)
      const targetSize = Math.floor(MAX_CONNECTIONS * 0.8);
      const toRemove = clients.length - targetSize;
      
      if (toRemove > 0) {
        console.log(`Over connection limit threshold, removing ${toRemove} oldest connections`);
        
        // Close and remove oldest connections
        for (let i = 0; i < toRemove; i++) {
          if (i < clients.length) {
            const { client } = clients[i];
            if (client.readyState === WebSocket.OPEN) {
              client.close(1000, 'Connection closed due to server load management');
            }
          }
        }
        
        // Remove the closed connections
        clients.splice(0, toRemove);
      }
    }
    
    // Log the cleanup results
    const removedCount = initialCount - clients.length;
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} WebSocket connections. Remaining: ${clients.length}`);
    }
  }
  
  // WebSocket event handlers
  wss.on('connection', (ws) => {
    cleanupConnections();
    
    // Check connection limit after cleanup
    if (clients.length >= MAX_CONNECTIONS) {
      console.log('Connection limit reached, rejecting new connection');
      ws.close(1013, 'Maximum connection limit reached');
      return;
    }
    
    // Add client to the array with current timestamp
    const timestampedClient: TimestampedClient = {
      client: ws,
      timestamp: Date.now()
    };
    clients.push(timestampedClient);
    
    console.log('WebSocket client connected. Total connections:', clients.length);
    
    // Send a welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Gorilla Smoke & Grill WebSocket Server'
    }));
    
    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Only log non-ping messages to reduce console noise
        if (data.type !== 'ping') {
          console.log('Received message:', data);
        }
        
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
      // Find and remove the client from our array
      const index = clients.findIndex(item => item.client === ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log('WebSocket client disconnected. Remaining connections:', clients.length);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      // Find and remove the client from our array
      const index = clients.findIndex(item => item.client === ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
  });
  
  // Function to broadcast messages to all connected clients
  function broadcastMessage(message: any) {
    const messageString = JSON.stringify(message);
    
    clients.forEach(({ client }) => {
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
