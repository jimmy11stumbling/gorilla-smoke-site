import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections, FaExternalLinkAlt, FaMapMarked, FaRegCalendarAlt, FaChevronDown, FaWheelchair } from 'react-icons/fa';
import { locations, type Location } from './LocationSelector';
import { useLocation } from '../contexts/LocationContext';
import OptimizedImage from './OptimizedImage';
import InteractiveMap from './InteractiveMap';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
        <OptimizedImage 
          src={location.image} 
          alt={location.name} 
          width={480}
          height={320}
          className="w-full h-full object-cover"
          loading="eager"
          quality={85}
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
        <p className="text-sm text-foreground/80 mb-3">{location.address}, {location.zipCode}</p>
        
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
                <div className="text-xs text-foreground/50 mt-1 italic">See all hours below</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {location.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="border-primary/30 text-foreground/80">
              {feature}
            </Badge>
          ))}
          {location.features.length > 3 && (
            <Badge variant="outline" className="border-primary/30">+{location.features.length - 3} more</Badge>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            size="sm"
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              window.open(location.mapUrl, '_blank');
              trackAnalyticsEvent('external_navigation', { 
                destination: 'google_maps', 
                locationId: location.id 
              });
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

const LocationSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentLocation, setCurrentLocationById, setShowLocationSelector } = useLocation();
  const [activeLocationId, setActiveLocationId] = useState(currentLocation.id);
  const [mapView, setMapView] = useState<'static' | 'interactive'>('static');
  const { toast } = useToast();
  
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
    
    trackAnalyticsEvent('location_selected', { locationId });
    
    toast({
      title: "Location Updated",
      description: `Now showing details for ${locations.find(loc => loc.id === locationId)?.name}`,
      duration: 3000,
    });
  };

  // Handle reservation button click
  const handleReservationClick = () => {
    setShowLocationSelector(true);
    
    trackAnalyticsEvent('reservation_requested', { 
      from: 'location_section', 
      locationId: activeLocationId 
    });
  };

  // Toggle map view
  const toggleMapView = () => {
    const newView = mapView === 'static' ? 'interactive' : 'static';
    setMapView(newView);
    
    trackAnalyticsEvent('map_view_changed', { 
      view: newView, 
      locationId: activeLocationId 
    });
  };

  // Find the active location object
  const activeLocation = locations.find(loc => loc.id === activeLocationId) || locations[0];

  return (
    <section id="locations" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <h2 className="text-4xl font-bold font-oswald uppercase mb-3 tracking-wide">
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">FIND</span> US
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Visit one of our three convenient locations in Laredo for an unforgettable dining experience
          </p>
        </div>

        {/* Location Tabs */}
        <Tabs 
          defaultValue={activeLocationId} 
          value={activeLocationId}
          onValueChange={handleLocationSelect}
          className={`w-full max-w-4xl mx-auto mb-8 transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {locations.map(location => (
              <TabsTrigger 
                key={location.id} 
                value={location.id}
                className="py-3 data-[state=active]:text-white data-[state=active]:bg-primary"
              >
                {location.name.split(' - ')[1] || location.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
        
        {/* Toggle button for map view */}
        <div className={`flex justify-center mb-6 transform transition-all duration-1000 delay-400 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <Button
            onClick={toggleMapView}
            variant="outline"
            className="flex items-center gap-2 border-primary/50 hover:border-primary"
          >
            {mapView === 'static' ? <FaMapMarked className="text-primary" /> : <FaMapMarkerAlt className="text-primary" />}
            {mapView === 'static' ? 'Switch to Interactive Map' : 'Switch to Classic View'}
          </Button>
        </div>
        
        {/* Map Display for Selected Location */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          {mapView === 'interactive' ? (
            <InteractiveMap 
              showAllLocations={true} 
              defaultLocationId={activeLocationId} 
              height="600px"
              className="mb-8"
            />
          ) : (
            <div className="mb-8">
              {/* Static Map with Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location Details */}
                <div className="md:col-span-1 order-2 md:order-1">
                  <div className="bg-card rounded-lg shadow-md border p-5">
                    <h3 className="text-xl font-bold mb-4 flex items-center text-primary">
                      <FaMapMarkerAlt className="mr-2" /> 
                      {activeLocation.name}
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <p className="text-foreground/90">{activeLocation.description}</p>
                      
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="mt-1 mr-3 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium">{activeLocation.address}</p>
                          <p>{activeLocation.city}, {activeLocation.state} {activeLocation.zipCode}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaPhone className="mt-1 mr-3 text-primary flex-shrink-0" />
                        <p>{activeLocation.phone}</p>
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible className="mb-4">
                      <AccordionItem value="hours">
                        <AccordionTrigger className="py-2">
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-primary" />
                            <span>Hours of Operation</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="py-1 space-y-2">
                            {activeLocation.hours.map((hour, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="font-medium">{hour.days}:</span>
                                <span>{hour.hours}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="features">
                        <AccordionTrigger className="py-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-primary">
                              <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                              <circle cx="17" cy="7" r="5" />
                            </svg>
                            <span>Features & Amenities</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2 py-2">
                            {activeLocation.features.map((feature, i) => (
                              <Badge key={i} variant="outline" className="border-primary/30">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="accessibility">
                        <AccordionTrigger className="py-2">
                          <div className="flex items-center">
                            <FaWheelchair className="mr-2 text-primary" />
                            <span>Accessibility</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 py-1 space-y-1 text-sm">
                            {activeLocation.accessibility.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Button 
                        className="flex items-center justify-center bg-primary hover:bg-primary/90"
                        onClick={handleReservationClick}
                      >
                        <FaRegCalendarAlt className="mr-2" />
                        Reserve
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex items-center justify-center"
                        onClick={() => {
                          window.open(activeLocation.mapUrl, '_blank');
                          trackAnalyticsEvent('external_navigation', { 
                            destination: 'google_maps', 
                            locationId: activeLocation.id 
                          });
                        }}
                      >
                        <FaDirections className="mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Google Map Embed */}
                <div className="md:col-span-2 order-1 md:order-2">
                  <div className="bg-card rounded-lg shadow-md border overflow-hidden h-full">
                    <div className="h-[350px] sm:h-[600px] w-full relative">
                      <iframe 
                        src={activeLocation.googleMapEmbedUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${activeLocation.name} on Google Maps`}
                      />
                      
                      <div className="absolute bottom-4 right-4 z-10">
                        <Button
                          size="default"
                          variant="default"
                          className="flex items-center shadow-md hover:shadow-lg bg-primary hover:bg-primary/90 text-white"
                          onClick={() => {
                            window.open(activeLocation.mapUrl, '_blank');
                            trackAnalyticsEvent('external_navigation', { 
                              destination: 'google_maps', 
                              locationId: activeLocation.id 
                            });
                          }}
                        >
                          <FaExternalLinkAlt className="mr-2" />
                          Open in Google Maps
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Reservation CTA */}
        <div className={`mt-12 text-center transform transition-all duration-1000 delay-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <p className="text-foreground/80 mb-4">Ready to visit? Make a reservation to secure your table.</p>
          <Button 
            variant="default" 
            size="lg"
            className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
            onClick={handleReservationClick}
          >
            <FaRegCalendarAlt className="mr-2" />
            Make a Reservation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
