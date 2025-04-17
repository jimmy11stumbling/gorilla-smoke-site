import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

// Main provider component
export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [location] = useLocation();
  const eventListenerSetRef = useRef<boolean>(false);

  // Function to track events
  const trackEvent = useCallback((eventName: string, data?: any) => {
    const newEvent: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      data,
    };
    
    // Add to local state
    setEvents(prev => {
      const updated = [...prev, newEvent];
      
      // For development, we store these events in localStorage
      if (updated.length % 5 === 0) {
        try {
          localStorage.setItem('site_analytics', JSON.stringify(updated.slice(-100)));
        } catch (e) {
          console.warn('Failed to save analytics to localStorage:', e);
        }
      }
      
      return updated;
    });
    
    // In a real app, we would send this to an analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, data);
    }

    // If we have a real analytics service, we would send data here
    // For example:
    // sendToAnalyticsService(eventName, data);
  }, []);

  // Set up listener for custom analytics events from non-component code
  useEffect(() => {
    if (!eventListenerSetRef.current && typeof window !== 'undefined') {
      const handleCustomEvent = (e: CustomEvent) => {
        const { eventName, timestamp, data } = e.detail;
        
        // Add the event to our state
        setEvents(prev => [...prev, { eventName, timestamp, data }]);
        
        // Log for development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Analytics] (window event) ${eventName}:`, data);
        }
      };
      
      window.addEventListener('analytics_tracking', handleCustomEvent as EventListener);
      eventListenerSetRef.current = true;
      
      return () => {
        window.removeEventListener('analytics_tracking', handleCustomEvent as EventListener);
        eventListenerSetRef.current = false;
      };
    }
  }, []);

  // Track page views automatically
  useEffect(() => {
    // Track page view
    trackEvent('page_view', { page: location });
    
    // Send page view data to server for SEO monitoring
    const seoData = {
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
        body: JSON.stringify(seoData),
      }).catch(err => console.error('Error sending SEO data:', err));
    } catch (e) {
      console.error('SEO monitoring error:', e);
    }
    
    // Track performance metrics
    if (window.performance && 'getEntriesByType' in window.performance) {
      try {
        const perfMetrics = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfMetrics) {
          const performanceData = {
            loadTime: perfMetrics.loadEventEnd - perfMetrics.loadEventStart,
            domContentLoaded: perfMetrics.domContentLoadedEventEnd - perfMetrics.domContentLoadedEventStart,
            firstPaint: perfMetrics.responseEnd - perfMetrics.requestStart,
            ttfb: perfMetrics.responseStart - perfMetrics.requestStart
          };
          
          trackEvent('performance_metrics', performanceData);
        }
      } catch (e) {
        console.warn('Unable to collect performance metrics:', e);
      }
    }
  }, [location, trackEvent]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, events }}>
      {children}
    </AnalyticsContext.Provider>
  );
}