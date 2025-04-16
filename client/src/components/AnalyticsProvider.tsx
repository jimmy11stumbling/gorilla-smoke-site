import { useEffect } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Default tracking ID - would be replaced with real one in production
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { 
        page_path: window.location.pathname,
        send_page_view: true
      });
    `;
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
    
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location,
        send_page_view: true
      });
    }
  }, [location]);

  return <>{children}</>;
}

// Event tracking utility functions
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, any> = {}
) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackReservation = (data: {
  locationId: string;
  date: string;
  time: string;
  partySize: number;
}) => {
  trackEvent('make_reservation', {
    location: data.locationId,
    reservation_date: data.date,
    reservation_time: data.time,
    party_size: data.partySize,
  });
};

export const trackDeliveryClick = (service: string, locationId: string) => {
  trackEvent('delivery_service_click', {
    delivery_service: service,
    location: locationId,
  });
};

export const trackMenuView = (category: string) => {
  trackEvent('view_menu_category', {
    menu_category: category,
  });
};

export const trackContactSubmission = () => {
  trackEvent('contact_form_submission');
};