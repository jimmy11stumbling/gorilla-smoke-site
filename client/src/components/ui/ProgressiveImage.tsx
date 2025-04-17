import React, { useState, useEffect } from 'react';
import { TINY_PLACEHOLDER, ProgressiveImageProps, useImage } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

export function ProgressiveImage({
  src,
  alt,
  className = '',
  width,
  height,
  category
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { imgSrc, loading, error, handleError, handleLoad } = useImage(src, category, width, height);
  
  // Reset loaded state when src changes
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)} 
         style={{ aspectRatio: width && height ? width/height : 'auto' }}>
      {/* Blurred tiny placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center blur-sm transform scale-105"
          style={{ backgroundImage: `url(${TINY_PLACEHOLDER})` }}
        />
      )}
      
      {/* Main image */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => {
          handleLoad();
          setIsLoaded(true);
        }}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300 ease-in-out',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      )}
    </div>
  );
}

export default ProgressiveImage;