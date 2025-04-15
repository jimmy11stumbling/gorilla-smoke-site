import { useState, useEffect, ImgHTMLAttributes } from 'react';
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
}

/**
 * OptimizedImage component provides:
 * - Proper loading attributes (lazy by default)
 * - Placeholder during loading
 * - Error handling for failed images
 * - Accessibility attributes
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
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Determine actual source URL - add query parameters for server-side processing
  // if the image is served from our own domain or is an asset
  const isAsset = src.includes('/assets/');
  const isLocalImage = src.startsWith('/') || src.startsWith(window.location.origin);
  
  // Use higher default quality for assets
  const effectiveQuality = isAsset && quality === 90 ? 95 : quality;
  
  const optimizedSrc = isLocalImage
    ? `${src}${src.includes('?') ? '&' : '?'}q=${effectiveQuality}${width ? `&w=${width}` : ''}${height ? `&h=${height}` : ''}`
    : src;
    
  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

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
          className="absolute inset-0"
          style={{ backgroundColor: placeholderColor }}
          aria-hidden="true"
        />
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        {...props}
      />
    </div>
  );
}