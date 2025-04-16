// This script removes any location header that might be present at the top of the page

(function() {
  function removeLocationHeader() {
    // Look for elements that match the location header pattern
    const possibleBanners = document.querySelectorAll('div');
    
    possibleBanners.forEach(el => {
      const text = el.textContent || '';
      const html = el.innerHTML || '';
      
      // Check for specific location text patterns
      if ((text.includes('Del Mar') && text.includes('Zapata') && text.includes('San Bernardo')) ||
          (html.includes('Del Mar: 3910') && html.includes('Zapata: 608') && html.includes('San Bernardo: 3301')) ||
          (html.includes('Del Mar') && html.includes('608 Zapata Hwy') && html.includes('3301 San Bernardo'))) {
        
        // Only target the top banner with red background, not the location section
        const isTopBanner = 
          el.getBoundingClientRect().top < 100 || // Banner is at the top
          el.classList.contains('bg-red-600') ||  // Has red background
          el.classList.contains('bg-primary') ||  // Has primary background
          el.parentElement?.classList.contains('bg-red-600') ||
          el.style.backgroundColor?.includes('red');
        
        if (isTopBanner) {
          console.log('Removing location banner:', el);
          el.style.display = 'none';
          // Also try to remove it completely
          try {
            el.remove();
          } catch (e) {
            console.error('Error removing element:', e);
          }
        }
      }
    });
  }
  
  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeLocationHeader);
  } else {
    removeLocationHeader();
  }
  
  // Also run after a short delay to catch dynamically rendered content
  setTimeout(removeLocationHeader, 500);
  setTimeout(removeLocationHeader, 1000);
  
  // And hook into window load event
  window.addEventListener('load', removeLocationHeader);
})();