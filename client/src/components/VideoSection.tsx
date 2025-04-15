import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AutoPlayVideo from './AutoPlayVideo';

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

    const videoSection = document.getElementById('video-section');
    if (videoSection) {
      observer.observe(videoSection);
    }

    return () => observer.disconnect();
  }, []);
  
  return (
    <section id="video-section" className="relative bg-neutral-900 text-white" aria-labelledby="video-heading">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
        <AutoPlayVideo
          src="/video/restaurant-ambiance.mp4"
          poster="/images/restaurant-interior.jpg"
          className="w-full h-full object-cover"
          muted
          loop
          lazy={false}
          priority
        />
      </div>
      
      <div className="container mx-auto px-4 py-24 relative z-20">
        <div className={cn(
          "max-w-2xl mx-auto text-center transform transition-all duration-1000",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <h2 
            id="video-heading" 
            className="text-4xl font-bold mb-6 font-oswald uppercase tracking-wide"
          >
            Experience the <span className="text-primary">Atmosphere</span>
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Immerse yourself in the warm, inviting ambiance of Gorilla Smoke & Grill. 
            Our restaurant combines rustic charm with modern comfort, creating the perfect 
            setting for an unforgettable dining experience.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#reservations"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Make a Reservation
            </a>
            <a
              href="#virtual-tour"
              className="inline-block px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Virtual Tour
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}