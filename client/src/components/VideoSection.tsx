import { useState, useEffect } from "react";

export default function VideoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Set up intersection observer to trigger animations when section is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const videoSection = document.getElementById("video-section");
    if (videoSection) {
      observer.observe(videoSection);
    }

    return () => {
      if (videoSection) {
        observer.unobserve(videoSection);
      }
    };
  }, []);

  return (
    <section 
      id="video-section" 
      className="py-16 bg-black relative overflow-hidden"
    >
      {/* Background overlay with noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNyIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA2Ii8+PC9zdmc+')] opacity-20 z-0"></div>
      
      {/* Additional visual elements for background interest */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-500/10 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-orange-500/10 to-transparent opacity-30"></div>
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className={`text-4xl font-bold font-oswald uppercase mb-2 tracking-wide transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <span className="text-primary">Experience</span> The Gorilla Difference
          </h2>
          <p 
            className={`text-white/80 max-w-2xl mx-auto transform transition-all duration-1000 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Watch our latest commercial showcasing our signature dishes and vibrant atmosphere
          </p>
        </div>
        
        <div 
          className={`aspect-video max-w-4xl mx-auto relative z-10 transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated glow effect behind the video */}
          <div className={`absolute -inset-4 bg-gradient-to-r from-orange-500 via-primary to-orange-500 blur-xl rounded-xl transition-all duration-300 ${
            isHovered ? "opacity-40 scale-105" : "opacity-20 scale-100"
          } animate-pulse-slow`}></div>
          
          {/* Decorative border with gradient */}
          <div className={`absolute -inset-1 bg-gradient-to-br from-orange-500 via-primary to-orange-500 rounded-lg transition-all duration-300 ${
            isHovered ? "p-[4px] opacity-100" : "p-[3px] opacity-90"
          }`}>
            <div className="absolute inset-0 bg-black rounded-lg"></div>
          </div>
          
          {/* Texture overlay for visual interest */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg z-0 overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')]"></div>
          </div>
          
          {/* Video container with slight inset shadow */}
          <div className="relative rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] z-10">
            <iframe 
              className="w-full h-full aspect-video relative z-10"
              src="https://www.youtube.com/embed/bfXPQZh4zyc?si=HwwpxvwbM4FqmQXI" 
              title="Gorilla Bar & Grill Promotional Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-[-6px] left-[-6px] w-5 h-5 border-t-2 border-l-2 border-orange-500 rounded-tl-md"></div>
          <div className="absolute top-[-6px] right-[-6px] w-5 h-5 border-t-2 border-r-2 border-orange-500 rounded-tr-md"></div>
          <div className="absolute bottom-[-6px] left-[-6px] w-5 h-5 border-b-2 border-l-2 border-orange-500 rounded-bl-md"></div>
          <div className="absolute bottom-[-6px] right-[-6px] w-5 h-5 border-b-2 border-r-2 border-orange-500 rounded-br-md"></div>
          
          {/* Additional accent lines for more emphasis */}
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        </div>
        
        <div 
          className={`flex flex-wrap justify-center gap-4 mt-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center space-x-2 text-white/80 py-2 px-4 rounded-full bg-white/5 backdrop-blur-sm">
            <i className="fas fa-utensils text-primary"></i>
            <span>Award-Winning Cuisine</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80 py-2 px-4 rounded-full bg-white/5 backdrop-blur-sm">
            <i className="fas fa-glass-cheers text-primary"></i>
            <span>Premium Bar Selection</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80 py-2 px-4 rounded-full bg-white/5 backdrop-blur-sm">
            <i className="fas fa-music text-primary"></i>
            <span>Live Entertainment</span>
          </div>
        </div>
      </div>
    </section>
  );
}