import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Process image with sharp library
function processImage(buffer: Buffer, width?: number, height?: number, quality: number = 80): Promise<Buffer> {
  let instance = sharp(buffer).rotate(); // Auto-rotate based on EXIF data
  
  if (width || height) {
    instance = instance.resize(width, height, { 
      fit: 'cover',
      withoutEnlargement: true,
    });
  }
  
  return instance
    .jpeg({ quality, progressive: true })
    .toBuffer();
}

// Memory cache for processed images
const memoryCache = new Map<string, { buffer: Buffer, timestamp: number }>();
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 1 week
const CACHE_SIZE_LIMIT = 100; // Max number of images to keep in memory

// Clean old cache entries
function cleanupCache() {
  const now = Date.now();
  let count = 0;
  
  // First remove expired entries
  Array.from(memoryCache.entries()).forEach(([key, entry]) => {
    if (now - entry.timestamp > CACHE_MAX_AGE) {
      memoryCache.delete(key);
    } else {
      count++;
    }
  });
  
  // If still over limit, remove oldest entries
  if (count > CACHE_SIZE_LIMIT) {
    const entries = Array.from(memoryCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
    const toRemove = entries.slice(0, count - CACHE_SIZE_LIMIT);
    toRemove.forEach(([key]) => {
      memoryCache.delete(key);
    });
  }
}

// Create cache key from request params
function getCacheKey(url: string, width?: number, height?: number, quality?: number): string {
  return crypto
    .createHash('md5')
    .update(`${url}|${width || 0}|${height || 0}|${quality || 80}`)
    .digest('hex');
}

// Main middleware function
export function imageOptimizer(req: Request, res: Response, next: NextFunction) {
  // Skip if not an image optimization request
  if (req.path !== '/api/image') {
    return next();
  }
  
  const url = req.query.url as string;
  const width = req.query.w ? parseInt(req.query.w as string) : undefined;
  const height = req.query.h ? parseInt(req.query.h as string) : undefined;
  const quality = req.query.q ? parseInt(req.query.q as string) : 80;
  
  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }
  
  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).send('Invalid URL');
  }
  
  // Check whitelist or enforce same-origin if needed
  // const allowedDomains = ['example.com', 'subdomain.example.org'];
  // const parsedUrl = new URL(url);
  // if (!allowedDomains.some(domain => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`))) {
  //   return res.status(403).send('Domain not in whitelist');
  // }
  
  // Use memory cache when possible
  const cacheKey = getCacheKey(url, width, height, quality);
  if (memoryCache.has(cacheKey)) {
    const cachedImage = memoryCache.get(cacheKey)!;
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=604800'); // 1 week
    return res.send(cachedImage.buffer);
  }
  
  // Clean cache occasionally
  if (Math.random() < 0.1) { // 10% chance on each request
    cleanupCache();
  }
  
  // Fetch and process the image
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      return response.buffer();
    })
    .then(buffer => processImage(buffer, width, height, quality))
    .then(processedBuffer => {
      // Cache the result
      memoryCache.set(cacheKey, {
        buffer: processedBuffer,
        timestamp: Date.now(),
      });
      
      // Send the response
      res.set('Content-Type', 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=604800'); // 1 week
      res.send(processedBuffer);
    })
    .catch(error => {
      console.error('Image processing error:', error);
      res.status(500).send('Failed to process image');
    });
}