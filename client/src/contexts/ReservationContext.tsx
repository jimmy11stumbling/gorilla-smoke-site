import React, { createContext, useContext, useState, ReactNode } from 'react';

type ReservationContextType = {
  openReservationModal: () => void;
  closeReservationModal: () => void;
  isReservationModalOpen: boolean;
};

// Create the context
const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const openReservationModal = () => {
    setIsReservationModalOpen(true);
  };

  const closeReservationModal = () => {
    setIsReservationModalOpen(false);
  };

  const value = {
    openReservationModal,
    closeReservationModal,
    isReservationModalOpen
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export const useReservation = (): ReservationContextType => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};