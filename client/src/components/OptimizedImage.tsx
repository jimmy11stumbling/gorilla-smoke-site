import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  quality?: number;
  placeholderColor?: string;
  priority?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  blur?: boolean;
}

/**
 * OptimizedImage component provides:
 * - Proper loading attributes (lazy by default)
 * - Responsive srcSet for different viewports
 * - Priority loading for LCP (Largest Contentful Paint) images
 * - Placeholder during loading with optional blur-up
 * - Error handling for failed images
 * - Accessibility attributes
 * - Core Web Vitals optimizations
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  quality = 90,
  placeholderColor = '#f3f4f6',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fetchpriority = 'auto',
  blur = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [srcSet, setSrcSet] = useState<string>('');
  
  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Use IntersectionObserver for better lazy loading
  useEffect(() => {
    // Only use IntersectionObserver for non-priority images
    if (!priority && loading === 'lazy' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && imgRef.current) {
              // Start loading the image when it's about to enter the viewport
              imgRef.current.loading = 'eager';
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '200px 0px', // Start loading 200px before it enters viewport
          threshold: 0.01,
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [priority, loading]);

  // Determine actual source URL and create srcSet
  useEffect(() => {
    // Determine if image is local or external
    const isAsset = src.includes('/assets/');
    const isStaffImage = src.includes('/images/staff/');
    const isLocalImage = src.startsWith('/') || src.startsWith(window.location.origin);
    
    // Use appropriate quality based on image type
    let effectiveQuality = quality;
    if (isStaffImage) {
      effectiveQuality = 100; // Maximum quality for staff photos
    } else if (isAsset && quality === 90) {
      effectiveQuality = 95; // Higher quality for assets
    }
    
    // Only create srcSet for local images that have width
    if (isLocalImage && width) {
      const widthMultipliers = [0.5, 1, 1.5, 2];
      const srcSetEntries = widthMultipliers.map(multiplier => {
        const w = Math.round(width * multiplier);
        const optimizedSrcForWidth = 
          `${src}${src.includes('?') ? '&' : '?'}q=${effectiveQuality}&w=${w}${height ? `&h=${Math.round(height * multiplier)}` : ''}`;
        return `${optimizedSrcForWidth} ${w}w`;
      });
      
      setSrcSet(srcSetEntries.join(', '));
    } else {
      setSrcSet('');
    }
  }, [src, width, height, quality]);
    
  const handleLoad = () => {
    setIsLoaded(true);
    
    // Report Core Web Vitals metrics if supported
    if (window.performance && 'measure' in window.performance) {
      try {
        window.performance.measure(`image-load-${src}`, 'navigationStart');
        
        // For priority images that might be LCP candidates
        if (priority && 'LargestContentfulPaint' in window) {
          console.log(`Priority image loaded: ${src}`);
        }
      } catch (e) {
        // Measurement may fail in some browsers
      }
    }
  };

  const handleError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  // Determine actual source URL 
  const isAsset = src.includes('/assets/');
  const isStaffImage = src.includes('/images/staff/');
  const isLocalImage = src.startsWith('/') || src.startsWith(window.location.origin);
  
  // Use appropriate quality based on image type
  let effectiveQuality = quality;
  if (isStaffImage) {
    effectiveQuality = 100; // Maximum quality for staff photos
  } else if (isAsset && quality === 90) {
    effectiveQuality = 95; // Higher quality for assets
  }
  
  const optimizedSrc = isLocalImage
    ? `${src}${src.includes('?') ? '&' : '?'}q=${effectiveQuality}${width ? `&w=${width}` : ''}${height ? `&h=${height}` : ''}`
    : src;

  // Handle case when image fails to load
  if (error) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{ width: width || '100%', height: height || '300px' }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block overflow-hidden" style={{ width: width || 'auto', height: height || 'auto' }}>
      {/* Placeholder shown until image is loaded */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0", 
            blur && "animate-pulse"
          )}
          style={{ backgroundColor: placeholderColor }}
          aria-hidden="true"
        />
      )}
      
      <img
        ref={imgRef}
        src={optimizedSrc}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        fetchpriority={priority ? 'high' : fetchpriority}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}