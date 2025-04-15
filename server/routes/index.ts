import type { Express } from "express";
import { registerStaticRoutes } from './static';
import { registerAdminRoutes } from './admin';
import { registerContactRoutes } from './contact';
import { registerMenuRoutes } from './menu';
import { registerOrderRoutes } from './orders';

export function registerAllRoutes(app: Express): void {
  // Register all routes
  registerStaticRoutes(app);
  registerAdminRoutes(app);
  registerContactRoutes(app);
  registerMenuRoutes(app);
  registerOrderRoutes(app);
}