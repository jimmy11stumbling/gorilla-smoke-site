import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FaCar, FaTruckPickup, FaBiking } from 'react-icons/fa';
import OrderModal from './OrderModal';
import { useLocation } from '../contexts/LocationContext';

// Define URLs for each delivery platform and location
type LocationData = {
  [key: string]: string;
  ubereats: string;
  doordash: string;
  grubhub: string;
};

type LocationsData = {
  [key: string]: LocationData;
  delmar: LocationData;
  zapata: LocationData;
  sanbernardo: LocationData;
};

const DELIVERY_URLS: LocationsData = {
  // Del Mar Avenue location
  delmar: {
    ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-del-mar",
    doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
    grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-3910-e-del-mar-laredo"
  },
  // Zapata Highway location
  zapata: {
    ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-south-zapata/aWqP3znNXFWWHp5xXNMywA",
    doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
    grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-608-south-zapata-highway-laredo/4937816"
  },
  // San Bernardo Avenue location
  sanbernardo: {
    ubereats: "https://www.ubereats.com/store/gorilla-smoke-and-grill-san-bernardo",
    doordash: "https://www.doordash.com/store/catering-by-gorilla-barbecue-smoke-and-grill-laredo-25137613/24404151/",
    grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke--grill-3301-san-bernardo-ave-laredo"
  }
};

type LocationId = 'delmar' | 'zapata' | 'sanbernardo';
type DeliveryService = 'ubereats' | 'doordash' | 'grubhub';

interface DeliveryButtonsProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabels?: boolean;
  vertical?: boolean;
  locationId?: LocationId; // Default location will be set in component
}

const DeliveryButtons: React.FC<DeliveryButtonsProps> = ({ 
  className = '', 
  size = 'default',
  showLabels = true,
  vertical = false,
  locationId // can be overridden by prop or will use context
}) => {
  const { toast } = useToast();
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { currentLocation } = useLocation();
  
  // Use locationId from props if provided, otherwise use the one from context
  const effectiveLocationId = (locationId || currentLocation.id) as LocationId;

  // This is the older direct link method that we're replacing with the lead capture flow
  const handleDirectDeliveryClick = (service: DeliveryService) => {
    // Open the URL for the specified location and service
    const url = DELIVERY_URLS[effectiveLocationId][service];
    window.open(url, '_blank');
    
    toast({
      title: `Opening ${service}`,
      description: "You'll be redirected to complete your order there.",
    });
  };

  // Use a single Order button that opens the modal
  const handleOrderClick = () => {
    setOrderModalOpen(true);
  };

  return (
    <>
      <div className={`${vertical ? 'flex flex-col space-y-3' : 'flex flex-wrap gap-3'} ${className}`}>
        <Button 
          onClick={handleOrderClick}
          size={size}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {showLabels ? "Order Online" : "Order"}
        </Button>
      </div>

      {/* Modal for lead capture */}
      <OrderModal 
        open={orderModalOpen} 
        onOpenChange={setOrderModalOpen} 
        locationId={effectiveLocationId}
      />
    </>
  );
};

export default DeliveryButtons;