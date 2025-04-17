import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Analytics event types
export type AnalyticsEvent = {
  eventName: string;
  timestamp: number;
  data?: any;
};

type AnalyticsContextType = {
  trackEvent: (eventName: string, data?: any) => void;
  events: AnalyticsEvent[];
};

// Create context with default values
const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {}, // Empty function as placeholder
  events: [],
});

// Hook to use analytics in components
export const useAnalytics = () => useContext(AnalyticsContext);

// Helper functions to track specific events
export const trackPageView = (page: string) => {
  const { trackEvent } = useAnalytics();
  trackEvent('page_view', { page });
};

export const trackMenuView = (category: string) => {
  const { trackEvent } = useAnalytics();
  trackEvent('menu_view', { category });
};

export const trackItemView = (itemId: number, itemName: string) => {
  const { trackEvent } = useAnalytics();
  trackEvent('item_view', { itemId, itemName });
};

export const trackExternalLink = (service: string, url: string) => {
  const { trackEvent } = useAnalytics();
  trackEvent('external_link_click', { service, url });
};

export const trackReservation = (date: string, time: string, partySize: number, locationId: string) => {
  const { trackEvent } = useAnalytics();
  trackEvent('reservation_attempt', { date, time, partySize, locationId });
};

// Main provider component
export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [location] = useLocation();

  // Track page views automatically
  useEffect(() => {
    trackPageView(location);
    
    // Send page view data to server
    const data = {
      path: location,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
    
    try {
      fetch('/api/seo/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch(err => console.error('Error sending analytics:', err));
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }, [location]);

  // Function to track events
  const trackEvent = (eventName: string, data?: any) => {
    const newEvent: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      data,
    };
    
    // Add to local state
    setEvents(prev => [...prev, newEvent]);
    
    // In a real app, we would send this to an analytics service
    console.log(`[Analytics] ${eventName}`, data);
    
    // For development, we can batched log these events
    if (events.length % 10 === 0) {
      localStorage.setItem('site_analytics', JSON.stringify(events.slice(-100)));
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, events }}>
      {children}
    </AnalyticsContext.Provider>
  );
}