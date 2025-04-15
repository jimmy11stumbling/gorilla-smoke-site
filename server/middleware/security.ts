import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { log } from '../vite';

/**
 * Sets up advanced security headers using Helmet
 * with customized Content Security Policy for the application
 */
export function setupSecurityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Set helmet with custom CSP for our application
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'https://api.mapbox.com'],
        frameSrc: ["'self'", 'https://www.google.com', 'https://www.youtube.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    // Set strict transport security with 1 year duration
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    // Prevent clickjacking attacks
    frameguard: {
      action: 'deny'
    },
    // Disable X-Powered-By header to prevent information disclosure
    hidePoweredBy: true,
    // Prevent MIME type sniffing
    noSniff: true,
    // Set X-XSS-Protection to prevent reflected XSS attacks
    xssFilter: true,
    // Referrer policy to control information passed in the Referer header
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  })(req, res, next);
}

/**
 * Adds feature policy headers to control browser features
 */
export function featurePolicyMiddleware(req: Request, res: Response, next: NextFunction) {
  // Set permissions policy (previously feature policy)
  res.setHeader('Permissions-Policy', [
    'camera=(self)',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
    'interest-cohort=()'
  ].join(', '));
  
  next();
}

/**
 * Adds cache control headers for static assets
 */
export function cacheControlMiddleware(req: Request, res: Response, next: NextFunction) {
  const url = req.url;
  
  // Different cache strategies based on file types
  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|ico|svg)$/i)) {
    // Cache images for 1 week
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  } else if (url.match(/\.(css|js|mjs)$/i)) {
    // Cache JavaScript and CSS for 1 day, allow stale content while revalidating
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  } else if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    // Cache fonts for 1 week
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  } else if (url.includes('/api/')) {
    // API responses - short cache with revalidation
    res.setHeader('Cache-Control', 'private, max-age=60, stale-while-revalidate=300');
  } else {
    // Set appropriate cache control for HTML documents
    res.setHeader('Cache-Control', 'private, no-cache, must-revalidate');
  }
  
  next();
}

/**
 * Adds HTTP/2 Server Push hints for critical resources
 */
export function http2ServerPushMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only apply to HTML requests and in production
  if (process.env.NODE_ENV === 'production' && req.headers.accept && req.headers.accept.includes('text/html')) {
    // Push critical CSS and JS files to improve initial load performance
    res.setHeader('Link', [
      '</assets/index.css>; rel=preload; as=style',
      '</assets/index.js>; rel=preload; as=script'
    ].join(', '));
    
    log('HTTP/2 Server Push hints added for critical resources', 'http2');
  }
  
  next();
}