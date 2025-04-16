import React, { createContext, useContext, useState, ReactNode } from 'react';
import ReservationModal from '@/components/ReservationModal';

type ReservationContextType = {
  openReservationModal: () => void;
  closeReservationModal: () => void;
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openReservationModal = () => setIsOpen(true);
  const closeReservationModal = () => setIsOpen(false);

  return (
    <ReservationContext.Provider
      value={{
        openReservationModal,
        closeReservationModal
      }}
    >
      {children}
      <ReservationModal open={isOpen} onOpenChange={setIsOpen} />
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