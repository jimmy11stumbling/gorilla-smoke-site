import React, { useState, useEffect } from 'react';
import { TINY_PLACEHOLDER, useImage, type ProgressiveImageProps } from '@/lib/imageUtils';

export default function ProgressiveImage({
  src,
  alt,
  className,
  width,
  height,
  category
}: ProgressiveImageProps) {
  const { imgSrc, loading, error, handleError, handleLoad } = useImage(src, category, width, height);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Reset loaded state if image src changes
    setIsLoaded(false);
  }, [imgSrc]);

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      {/* Low quality placeholder */}
      <img
        src={TINY_PLACEHOLDER}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover blur-sm transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          objectPosition: 'center', 
          objectFit: 'cover',
          filter: 'blur(10px)',
        }}
      />
      
      {/* Main image */}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          handleLoad();
          setIsLoaded(true);
        }}
        onError={handleError}
        loading="lazy"
        width={width}
        height={height}
      />
      
      {/* Loading and error state indicators */}
      {loading && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 text-white text-xs p-1 text-center">
          Image failed to load
        </div>
      )}
    </div>
  );
}