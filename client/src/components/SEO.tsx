import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string;
  schemaData?: Record<string, any>;
  pagePath?: string;
  language?: string;
  imageAlt?: string;
}

export default function SEO({
  title = 'Gorilla Smoke & Grill | Award-Winning BBQ Restaurant in Laredo, TX',
  description = 'Experience the best authentic Texas BBQ at Gorilla Smoke & Grill in Laredo. Serving smoky brisket, ribs, craft burgers, and homestyle sides. Family-owned, competition-grade BBQ with online ordering, catering, and private chef services.',
  canonical = 'https://gorillasmokegrill.com',
  ogImage = '/og-image.svg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'best BBQ Laredo, Texas BBQ restaurant, smoked brisket, Gorilla Smoke & Grill, slow-smoked meats, craft burgers Laredo, BBQ catering, award-winning ribs, private chef experience, online food ordering, family restaurant Laredo, live cooking demos, Mexican American fusion BBQ, craft beer BBQ pairing, weekend BBQ brunch',
  schemaData,
  pagePath,
  language = 'en-US',
  imageAlt = 'Gorilla Smoke & Grill - Authentic BBQ Restaurant in Laredo, Texas'
}: SEOProps) {
  const [location] = useLocation();
  const currentPath = pagePath || location;
  const currentUrl = `${canonical}${currentPath}`;
  
  // Determine page-specific meta information
  let pageTitle = title;
  let pageDescription = description;
  let pageKeywords = keywords;
  
  // Page-specific overrides
  if (currentPath.includes('/menu')) {
    pageTitle = 'Menu | Gorilla Smoke & Grill - Authentic Texas BBQ and Craft Burgers';
    pageDescription = 'Browse our full menu featuring award-winning smoked brisket, ribs, craft burgers, and homestyle sides. Made with locally-sourced ingredients and secret family recipes. Order online for pickup or delivery.';
    pageKeywords = 'Gorilla BBQ menu, smoked brisket Laredo, Texas BBQ menu, craft burgers, homestyle BBQ sides, family BBQ recipes, online BBQ ordering, Laredo restaurant menu, artisanal BBQ, smoker recipes';
  } else if (currentPath.includes('/about')) {
    pageTitle = 'About Us | Gorilla Smoke & Grill - Family-Owned BBQ Restaurant';
    pageDescription = 'Learn the story behind Gorilla Smoke & Grill, a family-owned BBQ restaurant with deep Texas roots. From BBQ competitions to our Laredo restaurant, discover our passion for authentic, flame-grilled cuisine.';
    pageKeywords = 'BBQ restaurant history, Gorilla Smoke & Grill story, family-owned restaurant Laredo, BBQ competition winners, Texas BBQ tradition, authentic smokehouse, BBQ restaurant owners, Laredo culinary scene';
  } else if (currentPath.includes('/contact')) {
    pageTitle = 'Contact Us | Gorilla Smoke & Grill - Reservations & Inquiries';
    pageDescription = 'Have questions or want to make a reservation? Contact Gorilla Smoke & Grill, Laredo\'s premier BBQ restaurant. We also offer catering services and private event hosting.';
    pageKeywords = 'BBQ restaurant contact, Gorilla Smoke & Grill reservation, Laredo restaurant phone number, BBQ catering inquiry, private dining Laredo, event hosting BBQ, restaurant feedback Laredo';
  } else if (currentPath.includes('/location')) {
    pageTitle = 'Visit Us | Gorilla Smoke & Grill - Location & Hours';
    pageDescription = 'Find Gorilla Smoke & Grill at 3910 E Del Mar Ave, Laredo, TX. Open daily from 11am to 11pm. Easy parking, wheelchair accessible, and family-friendly dining environment.';
    pageKeywords = 'BBQ restaurant location, Gorilla Smoke & Grill address, Laredo BBQ hours, restaurant parking Laredo, wheelchair accessible dining, family-friendly restaurant, Laredo BBQ map';
  } else if (currentPath.includes('/order')) {
    pageTitle = 'Order Online | Gorilla Smoke & Grill - Pickup & Delivery';
    pageDescription = 'Order Gorilla Smoke & Grill\'s award-winning BBQ online for convenient pickup or delivery. Fresh-smoked meats, homemade sides, and craft beverages delivered to your door.';
    pageKeywords = 'BBQ online ordering, Gorilla Smoke & Grill delivery, Laredo BBQ takeout, BBQ pickup order, food delivery Laredo, online BBQ menu, contactless BBQ ordering';
  } else if (currentPath.includes('/chef')) {
    pageTitle = 'Meet Our Chef | Gorilla Smoke & Grill - Master BBQ Pitmaster';
    pageDescription = 'Meet Ramiro Garza, award-winning pitmaster and head chef at Gorilla Smoke & Grill. Learn about his BBQ competition background and signature smoking techniques.';
    pageKeywords = 'BBQ chef profile, Gorilla Smoke & Grill pitmaster, Ramiro Garza chef, BBQ competition winner, Texas pitmaster, smoking techniques BBQ, chef background story';
  } else if (currentPath.includes('/staff')) {
    pageTitle = 'Staff Management | Gorilla Smoke & Grill - Admin Portal';
    pageDescription = 'Secure staff management portal for Gorilla Smoke & Grill restaurant employees. Access order management, kitchen notifications, and system monitoring tools.';
    pageKeywords = 'restaurant management system, BBQ restaurant staff portal, Gorilla Smoke & Grill admin, order management system, kitchen communication tools, restaurant operations, staff dashboard';
  }

  // Local business schema for restaurant is now moved to structured-data.json
  
  return (
    <Helmet>
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/icons/icon.svg" as="image" type="image/svg+xml" />
      <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/structured-data.json" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/restaurant-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Favicons */}
      <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
      <link rel="icon" href="/icons/icon-32x32.png" sizes="32x32" type="image/png" />
      <link rel="icon" href="/icons/icon-16x16.png" sizes="16x16" type="image/png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${canonical}${ogImage}`} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${canonical}${ogImage}`} />
      <meta name="twitter:image:alt" content={imageAlt} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={language} />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Gorilla Smoke & Grill" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Alternate languages */}
      <link rel="alternate" href={`${canonical}${currentPath}`} hrefLang="en-us" />
      <link rel="alternate" href={`${canonical}/es${currentPath}`} hrefLang="es-mx" />
      <link rel="alternate" href={`${canonical}${currentPath}`} hrefLang="x-default" />
      
      {/* Link to External Structured Data */}
      <link rel="alternate" type="application/ld+json" href="/structured-data.json" />
      
      {/* humans.txt */}
      <link rel="author" type="text/plain" href="/humans.txt" />
      
      {/* security.txt */}
      <link rel="help" href="/.well-known/security.txt" />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Gorilla Smoke & Grill" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
      <link rel="mask-icon" href="/icons/icon.svg" color="#1a1a1a" />
      
      {/* Social Sharing Optimization */}
      <meta property="og:site_name" content="Gorilla Smoke & Grill" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="es_MX" />
      <meta name="twitter:creator" content="@gorillabbq" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Laredo" />
      <meta name="geo.position" content="27.5036;-99.5075" />
      <meta name="ICBM" content="27.5036, -99.5075" />
      
      {/* Mobile App Tags */}
      <meta name="apple-itunes-app" content="app-id=myAppStoreID" />
      <meta name="google-play-app" content="app-id=com.gorillasmokegrill.app" />
      
      {/* Enhanced Social Media Presence */}
      <meta property="article:publisher" content="https://www.facebook.com/gorillasmokegrill" />
      <meta property="og:app_id" content="123456789" />
      
      {/* Additional Browser Compatibility */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="apple-touch-fullscreen" content="yes" />
      
      {/* Business & Local Search Optimization */}
      <meta name="business:contact_data:street_address" content="3910 E Del Mar Ave" />
      <meta name="business:contact_data:locality" content="Laredo" />
      <meta name="business:contact_data:region" content="TX" />
      <meta name="business:contact_data:postal_code" content="78045" />
      <meta name="business:contact_data:country_name" content="USA" />
      
      {/* Performance optimization hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* Page-specific next/prev relationships for paginated content */}
      {currentPath.includes('/menu/page/') && (
        <>
          <link rel="prev" href={`${canonical}/menu/page/${parseInt(currentPath.split('/').pop() || '1') - 1}`} />
          <link rel="next" href={`${canonical}/menu/page/${parseInt(currentPath.split('/').pop() || '1') + 1}`} />
        </>
      )}
    </Helmet>
  );
}