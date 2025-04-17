import { useEffect, useState, useCallback } from "react";
import logoImage from "../assets/gorilla-logo.jpg";
import DeliveryButtons from "./DeliveryButtons";
import OrderModal from "./OrderModal";

// Define hero carousel images - optimized for different sizes
const heroImages = [
  // Smaller, optimized versions with lower quality and size parameters
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70"
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Function to pause the carousel on hover/focus for better accessibility
  const [isPaused, setIsPaused] = useState(false);
  
  // Function to advance to the next image
  const nextImage = useCallback(() => {
    if (!isPaused) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }
  }, [isPaused]);
  
  // Function to go to the previous image
  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  }, []);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
    
    // Set up carousel interval
    const interval = setInterval(nextImage, 5000); // Change image every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <section id="home" className="relative h-screen bg-secondary overflow-hidden">
      {/* Background overlay with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 opacity-90 z-10"></div>
      
      {/* Carousel background images with subtle zoom effect */}
      <div 
        className="absolute inset-0 z-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-all duration-1500 ${
              currentImageIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img 
              src={image} 
              alt={`Gorilla Bar & Grill - Slide ${index + 1}`} 
              className="w-full h-full object-cover animate-kenBurns"
            />
          </div>
        ))}
      </div>
      
      {/* Carousel indicators */}
      {/* Navigation arrows */}
      <button 
        onClick={prevImage}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <button 
        onClick={nextImage}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 md:opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-24 left-0 right-0 z-20 flex flex-col items-center">
        <div className="flex justify-center space-x-2 mb-3">
          {heroImages.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? "bg-primary scale-125 shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" 
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-black/30 hover:bg-primary/60 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-primary"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            <i className="fas fa-play text-xs"></i>
          ) : (
            <i className="fas fa-pause text-xs"></i>
          )}
        </button>
      </div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNyIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA2Ii8+PC9zdmc+')] opacity-20 z-10"></div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20 text-center">
        {/* Logo image with animation */}
        <div 
          className={`mb-6 transform transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-xl animate-pulse opacity-70"></div>
            <img 
              src={logoImage} 
              alt="Gorilla Bar & Grill Logo" 
              className="h-full w-full object-contain relative z-10 drop-shadow-xl animate-float"
            />
          </div>
        </div>
        
        {/* Hero heading with animation */}
        <h1 
          className={`text-5xl md:text-7xl font-bold font-oswald text-white uppercase mb-4 tracking-wider drop-shadow-xl transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className="inline-block relative overflow-hidden">
            <span className="relative z-10">Gorilla</span>
            <span className="absolute bottom-2 left-0 w-full h-[6px] bg-gradient-to-r from-primary/50 to-primary/20 transform translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-700 ease-out"></span>
          </span>{" "}
          <span className="inline-block relative z-10 mx-1 px-1 animate-pulse-slow">
            <span className="text-accent">&</span>
          </span>{" "}
          <span className="inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-shimmer bg-[length:200%_auto]">Grill</span>
          </span>
        </h1>
        
        {/* Hero tagline with animation */}
        <p 
          className={`text-xl md:text-2xl text-white/90 mb-10 max-w-2xl drop-shadow-xl transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className="text-accent font-semibold">Unleash your appetite</span> with our flame-grilled perfection and premium bar selections.
        </p>
        
        {/* Call to action buttons with animation */}
        <div 
          className={`flex flex-col items-center gap-4 transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-md">
            <button 
              onClick={() => {
                const menuSection = document.getElementById('menu');
                if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative px-6 py-3 font-oswald uppercase tracking-wider rounded-md shadow-lg overflow-hidden group text-base sm:text-lg flex-1 bg-white text-primary font-bold hover:bg-white/90 transition-colors"
            >
              <span className="relative flex items-center justify-center gap-2">
                <i className="fas fa-utensils text-sm"></i>
                View Menu
              </span>
            </button>
            
            <button 
              onClick={() => setOrderModalOpen(true)}
              className="px-6 py-3 bg-accent text-white font-bold rounded-md hover:bg-accent/90 transition-colors animate-pulse-slow flex-1 relative group overflow-hidden"
            >
              <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="absolute inset-[-2px] bg-gradient-to-r from-white/20 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-105"></span>
              <span className="relative font-oswald uppercase tracking-wider flex items-center justify-center gap-2 z-10">
                <i className="fas fa-fire-alt text-sm"></i>
                Order Now
              </span>
            </button>
          </div>
          
          {/* Order modal */}
          <OrderModal 
            open={orderModalOpen}
            onOpenChange={setOrderModalOpen}
            locationId="delmar"
          />
        </div>
      </div>
      
      {/* Visit all locations callout */}
      <div className="absolute bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-center items-center text-white/90">
          <div className="flex items-center group">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
              <i className="fas fa-map-marker-alt"></i>
            </span>
            <span className="group-hover:text-white transition-colors duration-300">
              <span className="text-accent font-semibold">Visit our locations</span> - See the Locations section for our three Laredo spots
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
