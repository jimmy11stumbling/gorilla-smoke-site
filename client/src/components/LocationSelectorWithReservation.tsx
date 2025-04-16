import React, { useState } from 'react';
import LocationSelector from './LocationSelector';
import { useLocation } from '@/contexts/LocationContext';
import { useReservation } from '@/contexts/ReservationContext';

interface LocationSelectorWithReservationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationSelectorWithReservation: React.FC<LocationSelectorWithReservationProps> = ({ 
  open,
  onOpenChange
}) => {
  const { currentLocation, setCurrentLocationById } = useLocation();
  const { openReservationModal } = useReservation();
  
  const handleLocationSelected = (locationId: string) => {
    setCurrentLocationById(locationId);
  };
  
  const handleReservationRequest = (locationId: string) => {
    // First set the location
    setCurrentLocationById(locationId);
    
    // Then open the reservation modal
    setTimeout(() => {
      openReservationModal();
    }, 100);
  };
  
  return (
    <LocationSelector
      open={open}
      onOpenChange={onOpenChange}
      onLocationSelected={handleLocationSelected}
      currentLocationId={currentLocation.id}
      onReservationRequest={handleReservationRequest}
    />
  );
};

export default LocationSelectorWithReservation;