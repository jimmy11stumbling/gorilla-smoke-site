import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { FaMapMarkerAlt, FaStoreAlt, FaDirections, FaExternalLinkAlt } from "react-icons/fa";
import OptimizedImage from "./OptimizedImage";

// Define location data type
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: {
    days: string;
    hours: string;
  }[];
  mapUrl: string;
  googleMapEmbedUrl: string;
  image: string;
}

// Location data
export const locations: Location[] = [
  {
    id: "delmar",
    name: "Gorilla Smoke & Grill - Delmar",
    address: "3720 E Del Mar Blvd",
    city: "Laredo",
    state: "TX",
    zipCode: "78041",
    phone: "(956) 717-4304",
    hours: [
      { days: "Monday-Thursday", hours: "11:00 AM - 10:00 PM" },
      { days: "Friday-Saturday", hours: "11:00 AM - 11:00 PM" },
      { days: "Sunday", hours: "12:00 PM - 9:00 PM" }
    ],
    mapUrl: "https://maps.google.com/?q=Gorilla+Smoke+and+Grill+3720+E+Del+Mar+Blvd+Laredo+TX",
    googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.9813837085836!2d-99.44836852393876!3d27.562752828442064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8662740a4cd2e04d%3A0x3c79a53fc3d8f423!2s3720%20E%20Del%20Mar%20Blvd%2C%20Laredo%2C%20TX%2078041!5e0!3m2!1sen!2sus!4v1712962345678!5m2!1sen!2sus",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sanbernardo",
    name: "Gorilla Smoke & Grill - San Bernardo",
    address: "4615 San Bernardo Ave",
    city: "Laredo",
    state: "TX",
    zipCode: "78041",
    phone: "(956) 717-4305",
    hours: [
      { days: "Monday-Thursday", hours: "11:00 AM - 10:00 PM" },
      { days: "Friday-Saturday", hours: "11:00 AM - 11:00 PM" },
      { days: "Sunday", hours: "12:00 PM - 9:00 PM" }
    ],
    mapUrl: "https://maps.google.com/?q=Gorilla+Smoke+and+Grill+4615+San+Bernardo+Ave+Laredo+TX",
    googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.223456789012!2d-99.50761234567890!3d27.52379012345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866274b9a1a2b3c7%3A0x8e5fcb7a7e8d9a0!2s4615%20San%20Bernardo%20Ave%2C%20Laredo%2C%20TX%2078041!5e0!3m2!1sen!2sus!4v1712962345679!5m2!1sen!2sus",
    image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "zapata",
    name: "Gorilla Smoke & Grill - Zapata",
    address: "702 S US Hwy 83",
    city: "Zapata",
    state: "TX",
    zipCode: "78076",
    phone: "(956) 765-5505",
    hours: [
      { days: "Monday-Thursday", hours: "11:00 AM - 9:00 PM" },
      { days: "Friday-Saturday", hours: "11:00 AM - 10:00 PM" },
      { days: "Sunday", hours: "12:00 PM - 8:00 PM" }
    ],
    mapUrl: "https://maps.google.com/?q=Gorilla+Smoke+and+Grill+702+S+US+Hwy+83+Zapata+TX",
    googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.123456789012!2d-99.27123456789012!3d26.91234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866786a9b1a2c3d5%3A0x7e8d9a0f1e2b3c4!2s702%20US-83%2C%20Zapata%2C%20TX%2078076!5e0!3m2!1sen!2sus!4v1712962345680!5m2!1sen!2sus",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
  }
];

export const getLocationById = (id: string): Location | undefined => {
  return locations.find(location => location.id === id);
};

interface LocationCardProps {
  location: Location;
  onSelect: (locationId: string) => void;
  isSelected: boolean;
  onReserve?: (locationId: string) => void;
}

// Location Card Component
const LocationCard: React.FC<LocationCardProps> = ({ location, onSelect, isSelected, onReserve }) => {
  return (
    <div 
      className={`p-4 bg-card border rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer 
        ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
      onClick={() => onSelect(location.id)}
    >
      <div className="h-40 mb-4 overflow-hidden rounded-md relative">
        <OptimizedImage
          src={location.image}
          alt={location.name}
          width={400}
          height={250}
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-1">{location.name}</h3>
      <div className="flex items-center text-sm text-foreground/70 mb-2">
        <FaMapMarkerAlt className="mr-1" />
        <span>{location.address}, {location.city}</span>
      </div>
      <div className="text-sm text-foreground/70 mb-4">
        <p className="mb-1">{location.phone}</p>
        <p>{location.hours[0].days}: {location.hours[0].hours}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            window.open(location.mapUrl, '_blank');
          }}
        >
          <FaDirections className="mr-1" />
          Directions
        </Button>
        <Button 
          size="sm" 
          variant={isSelected ? "default" : "outline"}
          className="flex items-center"
        >
          <FaStoreAlt className="mr-1" />
          {isSelected ? 'Selected' : 'Select'}
        </Button>
        {onReserve && (
          <Button 
            size="sm" 
            variant="secondary"
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onReserve(location.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Reserve
          </Button>
        )}
      </div>
    </div>
  );
};

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelected: (locationId: string) => void;
  currentLocationId?: string;
  onReservationRequest?: (locationId: string) => void;
}

// Main Location Selector Component
const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  open, 
  onOpenChange, 
  onLocationSelected,
  currentLocationId = "delmar",
  onReservationRequest
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocationId);
  const { toast } = useToast();

  // Update selected location when currentLocationId prop changes
  useEffect(() => {
    if (currentLocationId) {
      setSelectedLocation(currentLocationId);
    }
  }, [currentLocationId]);

  const handleConfirm = () => {
    onLocationSelected(selectedLocation);
    
    const locationName = getLocationById(selectedLocation)?.name || '';
    
    toast({
      title: "Location Selected",
      description: `You've selected ${locationName}`,
    });
    
    onOpenChange(false);
  };

  const handleReservationClick = (locationId: string) => {
    if (onReservationRequest) {
      onReservationRequest(locationId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your Preferred Location</DialogTitle>
          <DialogDescription>
            Choose the Gorilla Smoke & Grill location you'd like to order from or visit.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onSelect={setSelectedLocation}
              isSelected={selectedLocation === location.id}
              onReserve={onReservationRequest ? handleReservationClick : undefined}
            />
          ))}
        </div>
        
        {selectedLocation && (
          <div className="mt-4 bg-accent/5 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Selected Location: {getLocationById(selectedLocation)?.name}</h3>
            <div className="aspect-video w-full rounded-md overflow-hidden border">
              <iframe 
                src={getLocationById(selectedLocation)?.googleMapEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                sandbox="allow-scripts allow-same-origin allow-popups"
              ></iframe>
            </div>
            <div className="mt-2 text-sm text-foreground/70">
              <p>Hours:</p>
              {getLocationById(selectedLocation)?.hours.map((hour, index) => (
                <p key={index}>{hour.days}: {hour.hours}</p>
              ))}
            </div>
            
            {onReservationRequest && (
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => handleReservationClick(selectedLocation)}
                  className="bg-accent text-white hover:bg-accent/90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Reserve a Table at This Location
                </Button>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;