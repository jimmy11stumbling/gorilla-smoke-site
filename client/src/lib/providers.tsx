import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { LocationProvider } from '@/contexts/LocationContext';
import { ReservationProvider } from '@/contexts/ReservationContext';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

type ProviderProps = {
  children: React.ReactNode;
};

// A single wrapper component that combines all providers in the correct order
export function AppProviders({ children }: ProviderProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          <ErrorBoundary>
            <LocationProvider>
              <ErrorBoundary>
                <ReservationProvider>
                  {children}
                </ReservationProvider>
              </ErrorBoundary>
            </LocationProvider>
          </ErrorBoundary>
        </AnalyticsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}