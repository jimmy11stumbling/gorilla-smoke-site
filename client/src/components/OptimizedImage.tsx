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

  // Check if the image is a relative path or an absolute URL
  const isRelative = !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:');
  
  // Construct optimized image URL if needed
  useEffect(() => {
    // For relative paths, create a optimized image URL
    if (isRelative) {
      localSrc.current = src;
    } else {
      // For external URLs (absolute paths), use the original URL
      localSrc.current = src;
      
      // If the image was already loaded and src changes, reset states
      if (isLoaded) {
        setIsLoaded(false);
        setError(false);
      }
    }
  }, [src, width, height, quality, isRelative, isLoaded]);

  // Intersection Observer for lazy loading
  useEffect(() => {
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
        rootMargin: '100px', // Start loading when image is 100px from viewport
        threshold: 0.1 // Trigger when at least 10% of the image is visible
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
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setError(true);
    // You could set a fallback image here
  };

  // Create base64 placeholder (simple implementation)
  // Ensure width and height are positive numbers
  const placeholderWidth = (width && width > 0) ? width : 100;
  const placeholderHeight = (height && height > 0) ? height : 100;
  const placeholder = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${placeholderWidth} ${placeholderHeight}"%3E%3Crect width="100%" height="100%" fill="${placeholderColor.replace('#', '%23')}"%3E%3C/rect%3E%3C/svg%3E`;

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
            opacity: 0.5
          }}
        />
      )}
      
      <img
        ref={imgRef}
        src={loading === 'eager' ? localSrc.current : placeholder}
        data-src={loading === 'lazy' ? localSrc.current : undefined}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        decoding="async"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500" aria-hidden="true">
          <ImageFailedIcon className="w-6 h-6 mr-2" />
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;