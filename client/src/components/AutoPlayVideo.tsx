import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  width?: number;
  height?: number;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  lazy?: boolean;
  observerOptions?: IntersectionObserverInit;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
}

/**
 * AutoPlayVideo component provides optimized video playback for better core web vitals
 * - Autoplay when in viewport
 * - Lazy loading for better performance
 * - Optimized for Core Web Vitals
 * - Supports poster images
 */
export default function AutoPlayVideo({
  src,
  poster,
  className,
  width,
  height,
  loop = true,
  muted = true,
  controls = false,
  preload = 'metadata',
  lazy = true,
  observerOptions = {
    rootMargin: '200px 0px',
    threshold: 0.1
  },
  objectFit = 'cover',
  priority = false
}: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy || priority);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (lazy && !priority && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      }, observerOptions);
      
      if (videoRef.current) {
        observer.observe(videoRef.current);
      }
      
      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }
  }, [lazy, priority, observerOptions]);
  
  // Handle autoplay when video is visible
  useEffect(() => {
    if (isVisible && videoRef.current && !isPlaying && !hasError) {
      // Report video load for performance tracking
      if (window.performance && 'mark' in window.performance) {
        try {
          window.performance.mark('video-attempt-play');
        } catch (e) {
          // Measurement may fail in some browsers
        }
      }
      
      // Some mobile browsers block autoplay, so we need to catch the error
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            
            // Mark successful playback for performance measurement
            if (window.performance && 'measure' in window.performance) {
              try {
                window.performance.mark('video-playing');
                window.performance.measure('video-load-to-play', 'video-attempt-play', 'video-playing');
              } catch (e) {
                // Measurement may fail in some browsers
              }
            }
          })
          .catch(error => {
            // Autoplay was prevented by the browser
            console.warn('Autoplay was prevented:', error);
            setHasError(true);
          });
      }
    }
  }, [isVisible, isPlaying, hasError]);
  
  // Handle video events
  const handleLoadedData = () => {
    if (isVisible && !isPlaying && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn('Autoplay prevented after load:', error);
        setHasError(true);
      });
    }
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handleError = () => {
    setHasError(true);
    console.error('Error loading video:', src);
  };
  
  // If error occurred, show fallback
  if (hasError) {
    return (
      <div 
        className={cn(
          'relative overflow-hidden bg-muted flex items-center justify-center',
          className
        )}
        style={{ 
          width: width || '100%', 
          height: height || 'auto',
          aspectRatio: width && height ? width / height : undefined 
        }}
      >
        {poster ? (
          <img 
            src={poster} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover"
            width={width}
            height={height}
          />
        ) : (
          <div className="text-muted-foreground text-sm p-4 text-center">
            Video playback unavailable
          </div>
        )}
      </div>
    );
  }
  
  return (
    <video
      ref={videoRef}
      className={cn('w-full', className)}
      width={width}
      height={height}
      poster={poster}
      preload={preload}
      muted={muted}
      loop={loop}
      playsInline
      controls={controls}
      onLoadedData={handleLoadedData}
      onPlay={handlePlay}
      onPause={handlePause}
      onError={handleError}
      style={{ objectFit }}
      aria-label="Background video"
    >
      {isVisible && <source src={src} type="video/mp4" />}
      {poster && <img src={poster} alt="Video placeholder" />}
    </video>
  );
}