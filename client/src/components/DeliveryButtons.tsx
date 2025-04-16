import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FaCar, FaTruckPickup, FaBiking } from 'react-icons/fa';
import OrderModal from './OrderModal';

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
    ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill-del-mar",
    doordash: "https://www.doordash.com/store/gorilla-smoke-grill-del-mar-laredo-23760291/",
    grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill-del-mar-3910-e-del-mar-ave-laredo"
  },
  // Zapata Highway location
  zapata: {
    ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill-zapata",
    doordash: "https://www.doordash.com/store/gorilla-smoke-grill-zapata-laredo-24582104/",
    grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill-zapata-608-zapata-hwy-laredo"
  },
  // San Bernardo Avenue location
  sanbernardo: {
    ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill-san-bernardo",
    doordash: "https://www.doordash.com/store/gorilla-smoke-grill-san-bernardo-laredo-24789216/",
    grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill-san-bernardo-3301-san-bernardo-ave-laredo"
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
  locationId = 'delmar' // Default to Del Mar location
}) => {
  const { toast } = useToast();
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // This is the older direct link method that we're replacing with the lead capture flow
  const handleDirectDeliveryClick = (service: DeliveryService) => {
    // Open the URL for the specified location and service
    const url = DELIVERY_URLS[locationId][service];
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
        locationId={locationId}
      />
    </>
  );
};

export default DeliveryButtons;