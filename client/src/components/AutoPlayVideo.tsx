import { useRef, useEffect, useState } from 'react';

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  defaultVolume?: number; // 0-1
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export default function AutoPlayVideo({
  src,
  poster,
  defaultVolume = 0.5, // Medium volume by default
  loop = true,
  muted = false,
  className = ''
}: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [showControls, setShowControls] = useState(false);

  // Set initial volume and autoplay when component mounts
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Set initial volume
    videoElement.volume = defaultVolume;
    
    // Try to autoplay the video
    const playPromise = videoElement.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay started successfully
          setIsPlaying(true);
        })
        .catch(error => {
          // Autoplay was prevented
          console.warn('Autoplay was prevented:', error);
          setIsPlaying(false);
          
          // In most browsers, autoplay is only allowed with muted videos
          // If autoplay fails, we can try again with muted audio
          videoElement.muted = true;
          videoElement.play()
            .then(() => {
              setIsPlaying(true);
              // Unmute after a user interaction
              const unmute = () => {
                videoElement.muted = false;
                videoElement.volume = volume;
                document.removeEventListener('click', unmute);
              };
              document.addEventListener('click', unmute);
            })
            .catch(err => {
              console.error('Even muted autoplay failed:', err);
            });
        });
    }
    
    // Add event listeners
    videoElement.addEventListener('play', () => setIsPlaying(true));
    videoElement.addEventListener('pause', () => setIsPlaying(false));
    
    // Cleanup function
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.removeEventListener('play', () => setIsPlaying(true));
        videoElement.removeEventListener('pause', () => setIsPlaying(false));
      }
    };
  }, [defaultVolume]);
  
  // Update video volume when volume state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle play/pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        loop={loop}
        playsInline // Important for mobile devices
        preload="auto"
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Custom video controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2 flex items-center space-x-4 transform transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <button 
          onClick={togglePlay}
          className="text-white focus:outline-none"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        
        <div className="flex items-center space-x-2 flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l3.182-3.182m-6.364 0L9 10.464m12.728 3.182l3.182 3.182m-3.182-3.182L9 13.536" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer focus:outline-none"
            aria-label="Volume control"
          />
          <span className="text-white text-xs min-w-[2.5rem]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}