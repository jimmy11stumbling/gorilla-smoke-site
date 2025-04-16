import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Location, locations, getLocationById } from '../components/LocationSelector';

interface LocationContextType {
  currentLocation: Location;
  setCurrentLocationById: (locationId: string) => void;
  showLocationSelector: boolean;
  setShowLocationSelector: (show: boolean) => void;
}

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider component
export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get the saved location from localStorage or default to "delmar"
  const [currentLocationId, setCurrentLocationId] = useState<string>(() => {
    const savedLocation = localStorage.getItem('preferredLocation');
    return savedLocation || 'delmar';
  });
  
  const [showLocationSelector, setShowLocationSelector] = useState<boolean>(false);
  
  // Find the actual location object based on the ID
  const currentLocation = getLocationById(currentLocationId) || locations[0];
  
  // Set location and save to localStorage
  const setCurrentLocationById = (locationId: string) => {
    setCurrentLocationId(locationId);
    localStorage.setItem('preferredLocation', locationId);
  };
  
  // On initial load, check if user has a location saved; if not, prompt them
  useEffect(() => {
    const savedLocation = localStorage.getItem('preferredLocation');
    if (!savedLocation) {
      // Show location selector after a slight delay for better UX
      const timer = setTimeout(() => {
        setShowLocationSelector(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const value = {
    currentLocation,
    setCurrentLocationById,
    showLocationSelector,
    setShowLocationSelector
  };
  
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook for using the context
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};