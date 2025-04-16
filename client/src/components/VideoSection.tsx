import { useState, useEffect } from "react";

export default function VideoSection() {
  const [isVisible, setIsVisible] = useState(false);

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
        
        {/* Simple, clean video container without any animations */}
        <div 
          className={`aspect-video max-w-4xl mx-auto relative z-10 transform transition-opacity duration-1000 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Simple static border */}
          <div className="absolute -inset-1 bg-primary rounded-lg">
            <div className="absolute inset-0 bg-black rounded-lg m-[3px]"></div>
          </div>
          
          {/* Video container */}
          <div className="relative rounded-lg overflow-hidden z-10">
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