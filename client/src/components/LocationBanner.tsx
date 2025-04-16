import { useEffect } from 'react';

export default function LocationBanner() {
  useEffect(() => {
    // Function to remove the location banner
    const removeLocationBanner = () => {
      // Find all potential location banner elements
      const banners = document.querySelectorAll('div');
      
      banners.forEach(element => {
        const text = element.textContent || '';
        
        // Check if this element contains location information for all three locations
        if ((text.includes('Del Mar') && text.includes('Zapata') && text.includes('San Bernardo')) ||
            element.classList.contains('location-header') ||
            element.classList.contains('bg-red-600')) {
          
          // Check if this is a top banner element (not the location section lower in the page)
          const isTopBanner = element.getBoundingClientRect().top < 150;
          
          if (isTopBanner) {
            console.log('Found location banner element, removing:', element);
            
            // Hide and remove the element
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.classList.add('hidden');
            element.setAttribute('aria-hidden', 'true');
            
            // Try to remove it from the DOM entirely
            try {
              element.remove();
            } catch (e) {
              console.error('Could not remove element:', e);
            }
          }
        }
      });
    };

    // Add the script to the document to ensure it runs early
    const script = document.createElement('script');
    script.src = '/location-header-remover.js';
    document.head.appendChild(script);
    
    // Run immediately
    removeLocationBanner();
    
    // Also run after a short delay to catch any dynamically rendered elements
    const timer1 = setTimeout(removeLocationBanner, 100);
    const timer2 = setTimeout(removeLocationBanner, 500);
    const timer3 = setTimeout(removeLocationBanner, 1000);
    
    // Run on window load event
    window.addEventListener('load', removeLocationBanner);
    
    // Clean up
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('load', removeLocationBanner);
    };
  }, []);

  // Component doesn't render anything visible
  return null;
}