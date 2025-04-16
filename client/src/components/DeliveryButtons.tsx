import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  const handleDeliveryClick = (service: DeliveryService) => {
    // Open the URL for the specified location and service
    const url = DELIVERY_URLS[locationId][service];
    window.open(url, '_blank');
    
    toast({
      title: `Opening ${service}`,
      description: "You'll be redirected to complete your order there.",
    });
  };

  return (
    <div className={`${vertical ? 'flex flex-col space-y-3' : 'flex flex-wrap gap-3'} ${className}`}>
      <Button 
        onClick={() => handleDeliveryClick('ubereats')} 
        size={size}
        className="bg-[#06C167] hover:bg-[#06C167]/90 text-white"
      >
        <i className="fas fa-car mr-2"></i>
        {showLabels && "Order on UberEats"}
      </Button>
      
      <Button 
        onClick={() => handleDeliveryClick('doordash')} 
        size={size}
        className="bg-[#FF3008] hover:bg-[#FF3008]/90 text-white"
      >
        <i className="fas fa-truck mr-2"></i>
        {showLabels && "Order on DoorDash"}
      </Button>
      
      <Button 
        onClick={() => handleDeliveryClick('grubhub')} 
        size={size}
        className="bg-[#F63440] hover:bg-[#F63440]/90 text-white"
      >
        <i className="fas fa-biking mr-2"></i>
        {showLabels && "Order on Grubhub"}
      </Button>
    </div>
  );
};

export default DeliveryButtons;