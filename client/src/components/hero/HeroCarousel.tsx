import { useState, useCallback, KeyboardEvent } from "react";

interface HeroCarouselProps {
  images: string[];
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Function to pause the carousel on hover/focus for better accessibility
  const [isPaused, setIsPaused] = useState(false);
  
  // Function to advance to the next image
  const nextImage = useCallback(() => {
    if (!isPaused) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  }, [isPaused, images.length]);
  
  // Function to go to the previous image
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Handle keyboard navigation for carousel accessibility
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextImage();
        e.preventDefault();
        break;
      case 'Home':
        setCurrentImageIndex(0);
        e.preventDefault();
        break;
      case 'End':
        setCurrentImageIndex(images.length - 1);
        e.preventDefault();
        break;
      case ' ':
      case 'Spacebar':
        setIsPaused(prev => !prev);
        e.preventDefault();
        break;
      default:
        break;
    }
  }, [nextImage, prevImage, images.length]);

  return (
    <>
      {/* Carousel background images with subtle zoom effect */}
      <div 
        id="hero-carousel"
        className="absolute inset-0 z-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label="Restaurant highlight images"
        tabIndex={0}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            id={`hero-slide-${index}`}
            className={`absolute inset-0 transition-all duration-1500 ${
              currentImageIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            role="tabpanel"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${images.length}`}
            aria-hidden={currentImageIndex !== index}
            tabIndex={currentImageIndex === index ? 0 : -1}
          >
            <img 
              src={image} 
              alt={`Gorilla Bar & Grill restaurant ambiance - image ${index + 1}`} 
              className="w-full h-full object-cover animate-kenBurns"
            />
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={prevImage}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-50 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Previous slide"
        aria-controls="hero-carousel"
        aria-disabled={isPaused}
      >
        <i className="fas fa-chevron-left" aria-hidden="true"></i>
      </button>
      
      <button 
        onClick={nextImage}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-50 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Next slide"
        aria-controls="hero-carousel"
        aria-disabled={isPaused}
      >
        <i className="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
      
      {/* Carousel indicators and controls */}
      <div className="absolute bottom-24 left-0 right-0 z-20 flex flex-col items-center" role="group" aria-label="Slideshow controls">
        <div className="flex justify-center space-x-2 mb-3" role="tablist" aria-label="Select a slide to display">
          {images.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                currentImageIndex === index 
                  ? "bg-primary scale-125 shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" 
                  : "bg-white/40 hover:bg-white/60 focus-visible:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={currentImageIndex === index}
              role="tab"
              tabIndex={currentImageIndex === index ? 0 : -1}
              aria-controls={`hero-slide-${index}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-black/30 hover:bg-primary/60 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          aria-pressed={isPaused}
        >
          {isPaused ? (
            <i className="fas fa-play text-xs" aria-hidden="true"></i>
          ) : (
            <i className="fas fa-pause text-xs" aria-hidden="true"></i>
          )}
        </button>
      </div>
    </>
  );
}