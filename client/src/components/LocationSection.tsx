import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections, FaExternalLinkAlt } from 'react-icons/fa';
import { locations, type Location } from './LocationSelector';
import { useLocation } from '../contexts/LocationContext';

// Location Card Component for displaying each location
const LocationCard: React.FC<{
  location: Location;
  isActive: boolean;
  onClick: () => void;
}> = ({ location, isActive, onClick }) => {
  return (
    <div 
      className={`bg-card rounded-lg shadow-lg border-2 transition-all ${isActive ? 'border-primary scale-105' : 'border-transparent hover:border-primary/50'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
          src={location.image} 
          alt={location.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-bold">{location.name}</h3>
          <div className="flex items-center text-sm mt-1">
            <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
            <span>{location.city}, {location.state}</span>
          </div>
        </div>
        {isActive && (
          <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-3">{location.address}, {location.zipCode}</p>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <FaPhone className="mt-1 mr-2 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">{location.phone}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaClock className="mt-1 mr-2 text-primary flex-shrink-0" />
            <div className="text-sm">
              {location.hours.slice(0, 1).map((hour, i) => (
                <div key={i}>{hour.days}: {hour.hours}</div>
              ))}
              {location.hours.length > 1 && (
                <div className="text-xs text-gray-500 mt-1 italic">See all hours below</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            size="sm"
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              window.open(location.mapUrl, '_blank')
            }}
          >
            <FaDirections className="mr-2" />
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
};

// Map Display Component for the selected location
const MapDisplay: React.FC<{
  location: Location;
}> = ({ location }) => {
  return (
    <div className="bg-card rounded-lg shadow-md border overflow-hidden h-full">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2 text-primary" />
          {location.name}
        </h3>
      </div>
      
      <div className="p-8 bg-white h-[350px] sm:h-[500px] flex flex-col items-center justify-center text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="96" 
          height="96" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-primary mb-8"
          aria-hidden="true"
        >
          <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        
        <div className="space-y-3 mb-10">
          <h4 className="text-2xl font-bold">{location.address}</h4>
          <p className="text-lg text-foreground/70">{location.city}, {location.state} {location.zipCode}</p>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <Button
            size="lg"
            className="flex items-center px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            onClick={() => window.open(location.mapUrl, '_blank')}
          >
            <FaExternalLinkAlt className="mr-3 text-lg" />
            Open in Google Maps
          </Button>
          
          <p className="text-sm text-foreground/60">
            View interactive map, directions, and navigation options
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <h4 className="font-bold mb-2">Hours of Operation</h4>
        <div className="space-y-1">
          {location.hours.map((hour, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="font-medium">{hour.days}:</span>
              <span>{hour.hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LocationSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentLocation, setCurrentLocationById } = useLocation();
  const [activeLocationId, setActiveLocationId] = useState(currentLocation.id);
  
  // Set up intersection observer to trigger animations
  useEffect(() => {
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

  // Update the active location ID when the current location changes
  useEffect(() => {
    setActiveLocationId(currentLocation.id);
  }, [currentLocation]);

  // Handle location selection
  const handleLocationSelect = (locationId: string) => {
    setActiveLocationId(locationId);
    setCurrentLocationById(locationId);
  };

  // Find the active location object
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];

  return (
    <section id="locations" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <h2 className="text-4xl font-bold font-oswald uppercase mb-3 tracking-wide">
            Our <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Locations</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Choose from one of our three convenient locations in the Laredo area
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          {/* Location Cards - All Three Locations */}
          {locations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              isActive={location.id === activeLocationId}
              onClick={() => handleLocationSelect(location.id)}
            />
          ))}
        </div>
        
        {/* Map Display for Selected Location */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <MapDisplay location={activeLocation} />
        </div>
        
        {/* Reservation CTA */}
        <div className={`mt-12 text-center transform transition-all duration-1000 delay-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-foreground/80 mb-4">Ready to visit? Make a reservation to secure your table.</p>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg"
          >
            Make a Reservation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;