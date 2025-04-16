import { useEffect } from 'react';

/**
 * A simplified SEO Monitor that just logs basic information without
 * attempting complex DOM interactions that might break rendering
 */
export default function SimpleSEOMonitor() {
  useEffect(() => {
    // Safely check environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Only run in non-admin pages
    if (window.location.pathname.includes('/admin')) {
      return;
    }

    // Use a longer delay to ensure the page is fully loaded
    const timeoutId = setTimeout(() => {
      try {
        // Collect basic SEO data that's unlikely to throw errors
        const basicSEOData = {
          url: window.location.href,
          timestamp: new Date().toISOString(),
          title: document.title || '(No title)',
          metaTags: {
            description: !!document.querySelector('meta[name="description"]'),
            viewport: !!document.querySelector('meta[name="viewport"]'),
            robots: !!document.querySelector('meta[name="robots"]')
          }
        };
        
        // Send to backend
        fetch('/api/seo/monitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(basicSEOData),
          keepalive: true,
        }).catch(err => {
          console.error('Error sending SEO data:', err);
        });
        
        // Log to console in non-production
        if (process.env.NODE_ENV !== 'production') {
          console.log('Basic SEO check completed:', basicSEOData);
        }
      } catch (error) {
        console.error('Error in simplified SEO monitor:', error);
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // This component doesn't render anything
  return null;
}