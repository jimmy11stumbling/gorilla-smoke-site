import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Mock image processing function
// In a real implementation, you'd use libraries like Sharp to resize and optimize images
function processImage(buffer: Buffer, width?: number, height?: number, quality?: number): Buffer {
  // For now, we're just returning the original buffer
  // In production, you would use Sharp to resize and optimize the image
  // Example with Sharp:
  // return await sharp(buffer)
  //   .resize({ width, height, fit: 'inside', withoutEnlargement: true })
  //   .jpeg({ quality: quality || 80 })
  //   .toBuffer();
  return buffer;
}

// Cache implementation
const memoryCache = new Map<string, { buffer: Buffer, timestamp: number }>();

// Cache TTL in milliseconds (24 hours)
const CACHE_TTL = 24 * 60 * 60 * 1000;

// Clean up old cache entries every hour
setInterval(() => {
  const now = Date.now();
  
  memoryCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_TTL) {
      memoryCache.delete(key);
    }
  });
}, 60 * 60 * 1000);

export function imageOptimizer(req: Request, res: Response, next: NextFunction) {
  const imagePath = req.path.replace(/^\/images\//, '');
  
  // Only process requests to /images/ path
  if (!req.path.startsWith('/images/')) {
    return next();
  }
  
  // Parse query parameters
  const width = req.query.w ? parseInt(req.query.w as string, 10) : undefined;
  const height = req.query.h ? parseInt(req.query.h as string, 10) : undefined;
  const quality = req.query.q ? parseInt(req.query.q as string, 10) : 80;
  
  // Validate parameters
  if ((width && isNaN(width)) || (height && isNaN(height)) || (quality && isNaN(quality))) {
    return res.status(400).send('Invalid parameters');
  }
  
  // Limit quality to range 1-100
  const safeQuality = Math.max(1, Math.min(100, quality));
  
  // Generate cache key
  const cacheKey = crypto
    .createHash('md5')
    .update(`${imagePath}-${width || 'auto'}-${height || 'auto'}-${safeQuality}`)
    .digest('hex');
  
  // Check cache
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    res.setHeader('Content-Type', getContentType(imagePath));
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cached.buffer);
  }
  
  // Find absolute path to the image
  const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);
  
  // Check if file exists
  fs.access(fullPath, fs.constants.R_OK, (err) => {
    if (err) {
      return next(); // Let express handle 404
    }
    
    // Read the file
    fs.readFile(fullPath, (err, buffer) => {
      if (err) {
        console.error('Error reading image:', err);
        return next();
      }
      
      try {
        // Process the image
        const processedBuffer = processImage(buffer, width, height, safeQuality);
        
        // Cache the result
        memoryCache.set(cacheKey, { buffer: processedBuffer, timestamp: Date.now() });
        
        // Send the processed image
        res.setHeader('Content-Type', getContentType(imagePath));
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(processedBuffer);
      } catch (err) {
        console.error('Error processing image:', err);
        return next();
      }
    });
  });
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}