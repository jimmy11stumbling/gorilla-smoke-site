import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define URLs for each delivery platform
const DELIVERY_URLS = {
  ubereats: "https://www.ubereats.com/store/gorilla-smoke-grill",
  doordash: "https://www.doordash.com/store/gorilla-smoke-grill-laredo-23760291/",
  grubhub: "https://www.grubhub.com/restaurant/gorilla-smoke-grill"
};

interface DeliveryButtonsProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabels?: boolean;
  vertical?: boolean;
}

const DeliveryButtons: React.FC<DeliveryButtonsProps> = ({ 
  className = '', 
  size = 'default',
  showLabels = true,
  vertical = false
}) => {
  const { toast } = useToast();

  const handleDeliveryClick = (platform: keyof typeof DELIVERY_URLS) => {
    window.open(DELIVERY_URLS[platform], '_blank');
    
    toast({
      title: `Opening ${platform}`,
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