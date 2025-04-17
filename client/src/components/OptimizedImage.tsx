import { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';

// Icon component for failed image loads
const ImageFailedIcon = (props: React.SVGProps<SVGSVGElement>) => <ImageOff {...props} />;

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholderColor?: string;
  quality?: number;
  onLoad?: () => void;
  onClick?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholderColor = '#f3f4f6',
  quality = 80,
  onLoad,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const localSrc = useRef<string>(src);
  const isMounted = useRef<boolean>(true);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Construct optimized image URL if needed
  useEffect(() => {
    // Check if the image is a relative path or an absolute URL
    const isRelative = !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:');
    
    // Reset state if src changes
    if (localSrc.current !== src) {
      if (isMounted.current) {
        setIsLoaded(false);
        setError(false);
      }
      
      // For relative paths, create an optimized image URL
      // For external URLs (absolute paths), use the original URL
      localSrc.current = src;
      
      // If this is a lazy-loaded image that was already in view,
      // we need to manually set the src since the observer won't fire again
      if (imgRef.current) {
        if (loading === 'lazy') {
          imgRef.current.dataset.src = src;
          if (observer.current) {
            // Re-observe the image to ensure lazy loading works
            observer.current.observe(imgRef.current);
          }
        } else {
          // For eager loading, set src directly
          imgRef.current.src = src;
        }
      }
    }
  }, [src, width, height, quality, loading]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    // Check if IntersectionObserver is available (for older browsers)
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers that don't support IntersectionObserver
      if (imgRef.current && loading === 'lazy') {
        imgRef.current.src = localSrc.current;
      }
      return;
    }
    
    if (loading === 'lazy' && imgRef.current) {
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              observer.current?.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '200px', // Increased margin for mobile devices
        threshold: 0.01 // Lower threshold for mobile devices
      });
      
      observer.current.observe(imgRef.current);
    }
    
    return () => {
      if (observer.current && imgRef.current) {
        observer.current.unobserve(imgRef.current);
        observer.current.disconnect();
      }
    };
  }, [loading]);

  const handleImageLoad = () => {
    if (isMounted.current) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  };

  const handleImageError = () => {
    if (isMounted.current) {
      console.error(`Image failed to load: ${src}`);
      setError(true);
    }
  };

  // Create base64 placeholder (simple implementation)
  // Ensure width and height are positive numbers
  const placeholderWidth = (width && width > 0) ? width : 100;
  const placeholderHeight = (height && height > 0) ? height : 100;
  const placeholder = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${placeholderWidth} ${placeholderHeight}"%3E%3Crect width="100%" height="100%" fill="${placeholderColor.replace('#', '%23')}"%3E%3C/rect%3E%3C/svg%3E`;

  // For mobile browsers, use eager loading more aggressively
  const isMobile = typeof window !== 'undefined' && 
                   window.matchMedia && 
                   window.matchMedia('(max-width: 768px)').matches;
  
  // On mobile, we'll use the image directly without lazy loading
  const actualSrc = (isMobile || loading === 'eager') ? localSrc.current : placeholder;
  const actualDataSrc = (isMobile || loading === 'eager') ? undefined : localSrc.current;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: placeholderColor,
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        display: 'inline-block',
      }}
      onClick={onClick}
    >
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center animate-pulse"
          style={{ 
            backgroundImage: `url(${placeholder})`,
            opacity: 0.5,
            zIndex: 0
          }}
        />
      )}
      
      <img
        ref={imgRef}
        src={actualSrc}
        data-src={actualDataSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={isMobile ? 'eager' : loading}
        decoding="async"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}
      />
      
      {error && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 p-2 text-center" 
          aria-hidden="true"
          style={{ zIndex: 2 }}
        >
          <ImageFailedIcon className="w-6 h-6 mb-2" />
          <span className="text-sm">Image failed to load</span>
          <span className="text-xs mt-1 break-all">{src.substring(0, 30)}{src.length > 30 ? '...' : ''}</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;