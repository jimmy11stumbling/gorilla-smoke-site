import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaExternalLinkAlt, FaDirections, FaPhone, FaClock, FaParking, FaWheelchair } from 'react-icons/fa';
import { useLocation } from '../contexts/LocationContext';
import type { Location } from './LocationSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Fix the Leaflet icon issues with webpack
// This is required because webpack doesn't handle Leaflet's assets properly
const fixLeafletIcon = () => {
  // Use default icon
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom marker icons
const createCustomIcon = (color: string = '#FF5722') => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Change view component for centering map on active location
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [center, map, zoom]);
  return null;
};

interface LocationFeatureProps {
  icon: React.ReactNode;
  label: string;
}

const LocationFeature: React.FC<LocationFeatureProps> = ({ icon, label }) => (
  <div className="flex items-center space-x-2 text-sm">
    <div className="text-primary">{icon}</div>
    <span>{label}</span>
  </div>
);

interface LocationDetailCardProps {
  location: Location;
}

const LocationDetailCard: React.FC<LocationDetailCardProps> = ({ location }) => {
  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-primary">{location.name}</CardTitle>
        <CardDescription className="text-foreground/70">
          {location.address}, {location.city}, {location.state} {location.zipCode}
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-4 pt-2 space-y-3">
          <p className="text-sm text-foreground/80 mb-4">{location.description}</p>
          
          <LocationFeature 
            icon={<FaPhone size={14} />} 
            label={location.phone} 
          />
          
          <LocationFeature 
            icon={<FaParking size={14} />} 
            label={location.parking} 
          />
          
          <div className="flex flex-col space-y-1 mb-2">
            <div className="text-sm flex items-center space-x-2">
              <FaWheelchair className="text-primary" size={14} />
              <span className="font-medium">Accessibility:</span>
            </div>
            <ul className="text-sm pl-6 space-y-1 list-disc">
              {location.accessibility.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Indoor seating: <span className="font-medium">{location.seating.indoor}</span></span>
            <span>Outdoor seating: <span className="font-medium">{location.seating.outdoor}</span></span>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="p-4 pt-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {location.features.map((feature, i) => (
              <Badge key={i} variant="outline" className="border-primary/30 text-foreground">
                {feature}
              </Badge>
            ))}
          </div>
          
          {location.socialMedia && (
            <div className="mt-4 pt-3 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Follow Us:</h4>
              <div className="flex space-x-3">
                {location.socialMedia.facebook && (
                  <a 
                    href={location.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                
                {location.socialMedia.instagram && (
                  <a 
                    href={location.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                )}
                
                {location.socialMedia.twitter && (
                  <a 
                    href={location.socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="hours" className="p-4 pt-2">
          <div className="space-y-1 mb-4">
            <h4 className="text-sm font-medium">Hours of Operation:</h4>
            <div className="mt-2">
              {location.hours.map((hour, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-border/30 last:border-0">
                  <span className="font-medium">{hour.days}</span>
                  <span>{hour.hours}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-foreground/70 italic">
            <FaClock className="inline-block mr-1" size={12} />
            <span>Hours may vary during holidays and special events.</span>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex gap-2 pt-0 pb-4 px-4">
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1 flex items-center justify-center"
          onClick={() => window.open(location.mapUrl, '_blank')}
        >
          <FaDirections className="mr-2" size={14} />
          Directions
        </Button>
        <Button 
          size="sm" 
          variant="default"
          className="flex-1 flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <FaPhone className="mr-2" size={14} />
          Call
        </Button>
      </CardFooter>
    </Card>
  );
};

interface InteractiveMapProps {
  showAllLocations?: boolean;
  defaultLocationId?: string;
  height?: string;
  width?: string;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  showAllLocations = true,
  defaultLocationId,
  height = '500px',
  width = '100%',
  className = '',
}) => {
  // Fix leaflet icons
  useEffect(() => {
    fixLeafletIcon();
  }, []);
  
  const { currentLocation, locations: allLocations, setCurrentLocationById } = useLocation();
  const [activeLocation, setActiveLocation] = useState<Location>(
    defaultLocationId 
      ? allLocations.find(loc => loc.id === defaultLocationId) || currentLocation
      : currentLocation
  );
  
  // Custom icon for the active location
  const activeIcon = useRef(createCustomIcon('red')).current;
  // Custom icon for other locations
  const regularIcon = useRef(createCustomIcon('blue')).current;
  
  // Map center coordinates based on active location
  const center: [number, number] = [
    activeLocation.coordinates.lat,
    activeLocation.coordinates.lng
  ];
  
  // Handle marker click
  const handleMarkerClick = (location: Location) => {
    setActiveLocation(location);
    setCurrentLocationById(location.id);
  };
  
  // Map container style
  const mapStyle = {
    height,
    width,
  };
  
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
      <div className="lg:col-span-2 bg-card rounded-lg overflow-hidden shadow-lg border border-border h-full">
        <MapContainer 
          center={center} 
          zoom={14} 
          scrollWheelZoom={false} 
          style={mapStyle}
          className="z-10"
        >
          <ChangeView center={center} zoom={14} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Display all locations if showAllLocations is true, otherwise just show the active one */}
          {showAllLocations 
            ? allLocations.map(location => (
                <Marker
                  key={location.id}
                  position={[location.coordinates.lat, location.coordinates.lng]}
                  icon={location.id === activeLocation.id ? activeIcon : regularIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(location),
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-base mb-1">{location.name}</h3>
                      <p className="text-sm mb-2">{location.address}</p>
                      <button 
                        onClick={() => handleMarkerClick(location)}
                        className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                      >
                        Select This Location
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))
            : (
              <Marker
                position={[activeLocation.coordinates.lat, activeLocation.coordinates.lng]}
                icon={activeIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-base mb-1">{activeLocation.name}</h3>
                    <p className="text-sm">{activeLocation.address}</p>
                  </div>
                </Popup>
              </Marker>
            )
          }
        </MapContainer>
      </div>
      
      <div className="lg:col-span-1">
        <LocationDetailCard location={activeLocation} />
      </div>
    </div>
  );
};

export default InteractiveMap;