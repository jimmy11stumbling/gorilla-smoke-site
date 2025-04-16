import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections } from 'react-icons/fa';
import LocationSelector from './LocationSelector';
import { useLocation } from '../contexts/LocationContext';

const LocationSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { currentLocation, setCurrentLocationById, showLocationSelector, setShowLocationSelector } = useLocation();
  
  // If the context wants to show the selector (like for first-time users), open it
  useEffect(() => {
    if (showLocationSelector) {
      setSelectorOpen(true);
      // Reset the context flag after opening
      setShowLocationSelector(false);
    }
  }, [showLocationSelector, setShowLocationSelector]);
  
  useEffect(() => {
    // Set up intersection observer to trigger animations
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const locationSection = document.getElementById("locations");
    if (locationSection) {
      observer.observe(locationSection);
    }

    return () => observer.disconnect();
  }, []);

  const handleLocationSelected = (locationId: string) => {
    setCurrentLocationById(locationId);
  };

  return (
    <section id="locations" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <h2 className="text-4xl font-bold font-oswald uppercase mb-2 tracking-wide">
            Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Locations</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Visit one of our convenient locations in the Laredo area for a delicious meal
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 transform transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          {/* Left Side - Current Location Details */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
            <div className="h-48 sm:h-64 relative overflow-hidden">
              <img 
                src={currentLocation.image} 
                alt={currentLocation.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl sm:text-2xl font-bold font-oswald">{currentLocation.name}</h3>
                <div className="flex items-center flex-wrap mt-1">
                  <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{currentLocation.address}, {currentLocation.city}, {currentLocation.state} {currentLocation.zipCode}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <FaPhone className="mt-1 mr-3 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Contact</h4>
                    <p className="text-sm sm:text-base break-words">{currentLocation.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Hours</h4>
                    {currentLocation.hours.map((hour, index) => (
                      <p key={index} className="text-sm sm:text-base">{hour.days}: <span className="whitespace-nowrap">{hour.hours}</span></p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={() => window.open(currentLocation.mapUrl, '_blank')}
                >
                  <FaDirections className="mr-2" />
                  Get Directions
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setSelectorOpen(true)}
                >
                  Change Location
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Side - Map */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border h-64 sm:h-auto sm:aspect-square">
            <iframe 
              src={currentLocation.googleMapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>
        
        {/* Call to action - Visit all locations */}
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setSelectorOpen(true)}
            className="px-8 py-6 text-lg"
          >
            View All Locations
          </Button>
        </div>
      </div>
      
      {/* Location Selector Modal */}
      <LocationSelector 
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onLocationSelected={handleLocationSelected}
        currentLocationId={currentLocation.id}
      />
    </section>
  );
};

export default LocationSection;