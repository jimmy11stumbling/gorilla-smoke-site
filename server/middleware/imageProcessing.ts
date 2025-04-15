import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { log } from '../vite';

// Define supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

// Set cache duration - 1 week in seconds
const CACHE_DURATION = 60 * 60 * 24 * 7;

/**
 * Middleware to process and optimize images on-the-fly
 * Supports: resizing, quality adjustment, format conversion
 */
export function imageProcessingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only process GET requests to image files
  if (req.method !== 'GET') {
    return next();
  }

  // Check if the URL is for an image
  const ext = path.extname(req.path).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(ext)) {
    return next();
  }

  // Get processing parameters from query
  const width = req.query.w ? parseInt(req.query.w as string, 10) : null;
  const height = req.query.h ? parseInt(req.query.h as string, 10) : null;
  
  // Default to higher quality (90) for attached assets, 80 for regular images
  let defaultQuality = 80;
  if (req.path.includes('/assets/')) {
    defaultQuality = 95; // Higher quality for attached assets
  }
  
  const quality = req.query.q ? parseInt(req.query.q as string, 10) : defaultQuality;
  const format = req.query.format as string | undefined;

  // For image files, we'll process them even without transformation parameters
  // to ensure they're served with the correct content type
  // Skip processing only if no params were provided AND it's an external URL
  if (!width && !height && !format && !req.path.startsWith('/')) {
    return next();
  }

  // Determine source file path
  let filePath = '';
  
  // Handle attached_assets folder content
  if (req.path.includes('/assets/')) {
    // Log the asset request for debugging
    log(`Processing attached asset: ${req.path}`, 'image-processor');
    const assetFileName = path.basename(req.path);
    // Remove any URL-encoded parts
    const decodedFileName = decodeURIComponent(assetFileName);
    filePath = path.join(process.cwd(), 'attached_assets', decodedFileName);
    log(`Looking for file at: ${filePath}`, 'image-processor');
  } else {
    // For public folder content
    filePath = path.join(process.cwd(), 'public', req.path);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return next();
  }

  // Set up response headers for caching
  res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATION}`);
  res.setHeader('Vary', 'Accept-Encoding');

  // Start processing the image
  try {
    let transform = sharp(filePath);

    // Apply resizing if needed
    if (width || height) {
      transform = transform.resize(width || null, height || null, {
        fit: 'cover',
        withoutEnlargement: true
      });
    }

    // Handle format conversion
    let outputFormat = format;
    if (!outputFormat) {
      // Default to original format or webp for better compression
      // Remove the dot from extension for consistent format handling
      const originalFormat = ext.substring(1).toLowerCase();
      outputFormat = (req.headers.accept || '').includes('image/webp') ? 'webp' : originalFormat;
    }

    // Apply format-specific options
    switch (outputFormat) {
      case 'webp':
        transform = transform.webp({ quality });
        res.setHeader('Content-Type', 'image/webp');
        break;
      case 'avif':
        transform = transform.avif({ quality });
        res.setHeader('Content-Type', 'image/avif');
        break;
      case 'png':
        transform = transform.png({ quality: Math.floor(quality / 10) });
        res.setHeader('Content-Type', 'image/png');
        break;
      case 'jpg':
      case 'jpeg':
        transform = transform.jpeg({ quality });
        res.setHeader('Content-Type', 'image/jpeg');
        break;
      default:
        // Keep original format
        res.setHeader('Content-Type', `image/${ext.substring(1)}`);
    }

    // Process and send the image
    transform.pipe(res);
    
    log(`Image processed: ${req.path} (w:${width || 'auto'}, h:${height || 'auto'}, q:${quality}, format:${outputFormat})`, 'image-processor');
  } catch (error) {
    console.error(`Image processing error for path ${req.path} (file: ${filePath}):`, error);
    // Log whether the file exists
    console.log(`File exists check: ${fs.existsSync(filePath)}`);
    // Fall back to standard serving
    next();
  }
}