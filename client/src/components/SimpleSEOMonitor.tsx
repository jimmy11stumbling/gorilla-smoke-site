import { useEffect } from 'react';
import { useLocation } from 'wouter';

// A lightweight component that monitors important SEO metrics
export default function SimpleSEOMonitor() {
  const [location] = useLocation();

  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;
    
    // Track the key web vitals 
    const reportWebVitals = () => {
      try {
        const perfData = window.performance.getEntriesByType('navigation')[0] as any;
        
        // If we have performance data, collect the metrics
        if (perfData) {
          const metrics = {
            page: location,
            timeToFirstByte: perfData.responseStart - perfData.requestStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
            windowLoaded: perfData.loadEventEnd - perfData.navigationStart,
            interactive: perfData.domInteractive - perfData.navigationStart,
            renderTime: performance.now(), // Current time from navigation start
            connectionType: (navigator as any).connection ? (navigator as any).connection.effectiveType : 'unknown',
            saveData: (navigator as any).connection ? (navigator as any).connection.saveData : false
          };
          
          // Log metrics to console during development
          console.log('[SEO Metrics]', metrics);
          
          // Report metrics to server
          fetch('/api/seo/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metrics),
            // Use keepalive to ensure the request completes even on page unload
            keepalive: true
          }).catch(() => {
            // Silent fail - this is an enhancement, not critical functionality
          });
        }
      } catch (err) {
        // Silent failure - don't break the app for analytics
        console.error('[SEO Monitor]', err);
      }
    };

    // Wait for page to finish loading
    if (document.readyState === 'complete') {
      reportWebVitals();
    } else {
      window.addEventListener('load', reportWebVitals);
      return () => window.removeEventListener('load', reportWebVitals);
    }
  }, [location]);

  // This is a monitoring component, it doesn't render anything
  return null;
}