import React, { useEffect } from 'react';

export default function LocationBanner() {
  useEffect(() => {
    // This component doesn't render anything - it just cleans up the banner from the DOM on mount
    const removeLocationHeader = () => {
      // Look for elements that match the location banner signature
      const possibleBanners = document.querySelectorAll('div');
      
      possibleBanners.forEach(el => {
        const text = el.textContent || '';
        const html = el.innerHTML || '';
        
        // Check for specific location text patterns
        if ((text.includes('Del Mar') && text.includes('Zapata') && text.includes('San Bernardo')) ||
            (html.includes('Del Mar: 3910') && html.includes('Zapata: 608') && html.includes('San Bernardo: 3301')) ||
            (html.includes('Del Mar') && html.includes('608 Zapata Hwy') && html.includes('3301 San Bernardo'))) {
          
          // Only target the top banner, not the location section
          const isTopBanner = 
            el.getBoundingClientRect().top < 100 || // Banner is at the top
            el.classList.contains('bg-primary') ||  // Has primary background
            el.classList.contains('bg-red-600') ||  // Has a red background
            el.parentElement?.classList.contains('bg-red-600') ||
            el.style.backgroundColor?.includes('red');
          
          if (isTopBanner) {
            console.log('Removing location banner:', el);
            el.remove();
          }
        }
      });
    };
    
    // Run immediately after mount
    removeLocationHeader();
    
    // Also run after a short delay to handle dynamic rendering
    const timeoutId = setTimeout(removeLocationHeader, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // This component doesn't render anything
  return null;
}