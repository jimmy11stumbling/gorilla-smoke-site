import type { Express, Request, Response } from "express";
import path from "path";

export function registerStaticRoutes(app: Express): void {
  // Serve robots.txt and sitemap.xml from public folder
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
    res.set('Content-Type', 'application/xml');
  });
  
  app.get('/sitemap-:type.xml', (req: Request, res: Response) => {
    const type = req.params.type;
    const allowedTypes = ['main', 'menu', 'images'];
    
    if (!allowedTypes.includes(type)) {
      return res.status(404).send('Not found');
    }
    
    res.sendFile(path.join(process.cwd(), 'public', `sitemap-${type}.xml`));
    res.set('Content-Type', 'application/xml');
  });
  
  app.get('/sitemaps/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    
    if (!filename.endsWith('.xml')) {
      return res.status(404).send('Not found');
    }
    
    res.sendFile(path.join(process.cwd(), 'public', 'sitemaps', filename));
    res.set('Content-Type', 'application/xml');
  });
  
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
    res.set('Content-Type', 'text/plain');
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
  
  // Serve menu images with proper MIME types
  app.get('/images/menu/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'public', 'images', 'menu', filename);
    
    // Set the correct content type based on file extension
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (filename.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (filename.endsWith('.webp')) {
      res.set('Content-Type', 'image/webp');
    } else if (filename.endsWith('.svg')) {
      res.set('Content-Type', 'image/svg+xml');
    }
    
    res.sendFile(filePath);
  });
}