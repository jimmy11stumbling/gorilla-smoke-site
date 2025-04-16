import { useEffect } from 'react';

/**
 * SEOMonitor component for automated technical SEO health checks
 * This component runs a series of frontend SEO checks and sends the results to the backend
 * for logging and monitoring purposes.
 */
export default function SEOMonitor() {
  useEffect(() => {
    // Only run in production and non-admin pages
    if (window.location.pathname.includes('/admin')) {
      return;
    }

    // Run the SEO checks after a short delay to ensure page is fully loaded
    const timeoutId = setTimeout(() => {
      performSEOChecks();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const performSEOChecks = () => {
    try {
      const results = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        checks: {
          // Meta tag checks
          metaTags: {
            title: !!document.title,
            description: !!document.querySelector('meta[name="description"]'),
            viewport: !!document.querySelector('meta[name="viewport"]'),
            canonical: !!document.querySelector('link[rel="canonical"]'),
            robots: !!document.querySelector('meta[name="robots"]'),
          },
          // Schema.org structured data check
          structuredData: !!document.querySelector('script[type="application/ld+json"]'),
          // Image optimization check
          images: checkImages(),
          // Heading structure
          headings: checkHeadings(),
          // Internal links
          internalLinks: checkInternalLinks(),
          // Mobile friendliness indicators
          mobileFriendliness: {
            viewportTag: !!document.querySelector('meta[name="viewport"][content*="width=device-width"]'),
            touchIcons: !!document.querySelector('link[rel="apple-touch-icon"]'),
            legibleFontSizes: checkLegibleFontSizes(),
          },
          // Page speed indicators
          performance: {
            totalElements: document.querySelectorAll('*').length,
            imageCount: document.querySelectorAll('img').length,
            scriptCount: document.querySelectorAll('script').length,
            styleCount: document.querySelectorAll('link[rel="stylesheet"]').length,
          },
        },
      };

      // Send results to backend
      sendResultsToBackend(results);
      
      // Also log in console in non-production environments
      if (process.env.NODE_ENV !== 'production') {
        console.log('SEO Check Results:', results);
      }
    } catch (error) {
      console.error('Error in SEO monitoring:', error);
    }
  };

  const checkImages = () => {
    const images = document.querySelectorAll('img');
    const withAlt = Array.from(images).filter(img => !!img.alt).length;
    
    return {
      total: images.length,
      withAlt,
      altPercentage: images.length ? Math.round((withAlt / images.length) * 100) : 100,
      lazyLoaded: Array.from(images).filter(img => img.loading === 'lazy').length,
    };
  };

  const checkHeadings = () => {
    const h1Count = document.querySelectorAll('h1').length;
    const hasProperHierarchy = checkHeadingHierarchy();
    
    return {
      h1Count,
      hasH1: h1Count > 0,
      singleH1: h1Count === 1,
      properHierarchy: hasProperHierarchy,
    };
  };

  const checkHeadingHierarchy = () => {
    // Simple check to ensure heading hierarchy makes sense 
    // (doesn't skip levels in a way that would confuse screen readers)
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    let hierarchyValid = true;
    
    Array.from(headings).forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (currentLevel === 0) {
        // First heading should be h1
        hierarchyValid = hierarchyValid && (level === 1);
      } else {
        // Subsequent headings shouldn't skip levels by more than 1
        hierarchyValid = hierarchyValid && (level <= currentLevel + 1);
      }
      currentLevel = level;
    });
    
    return hierarchyValid;
  };

  const checkInternalLinks = () => {
    const links = document.querySelectorAll('a[href]');
    const internalLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href');
      return href && (
        href.startsWith('/') || 
        href.startsWith('#') || 
        href.includes(window.location.hostname)
      );
    });
    
    return {
      total: links.length,
      internal: internalLinks.length,
      withoutTitle: Array.from(links).filter(link => !link.title).length,
    };
  };

  const checkLegibleFontSizes = () => {
    // Basic check for font size legibility on mobile
    // A more comprehensive check would involve checking computed styles 
    // for all text elements
    const bodyFontSize = window.getComputedStyle(document.body).fontSize;
    const fontSize = parseInt(bodyFontSize);
    return fontSize >= 14; // 14px is generally considered minimum for mobile readability
  };

  const sendResultsToBackend = (results: any) => {
    // Send results to backend for logging and alerting
    fetch('/api/seo/monitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
      // Use keepalive to ensure request completes even if page navigates away
      keepalive: true,
    }).catch(error => {
      console.error('Error sending SEO monitoring data:', error);
    });
  };

  // This component doesn't render anything visible
  return null;
}