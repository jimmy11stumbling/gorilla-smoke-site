import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string;
  schemaData?: Record<string, any>;
}

export default function SEO({
  title = 'Gorilla Smoke & Grill | Authentic BBQ in Laredo, TX',
  description = 'Gorilla Smoke & Grill serves authentic, flame-grilled favorites in Laredo, TX. Family-owned restaurant featuring BBQ competitions, catering, and private chef experiences.',
  canonical = 'https://gorillasmokegrill.com',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'BBQ, Laredo restaurant, Texas barbecue, Gorilla Smoke & Grill, flame-grilled, smoking, grilling, catering, private chef, Mexican American fusion',
  schemaData,
}: SEOProps) {
  // Local business schema for restaurant
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Gorilla Smoke & Grill',
    image: ogImage,
    '@id': canonical,
    url: canonical,
    telephone: '+1-555-123-4567',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Laredo',
      addressRegion: 'TX',
      postalCode: '78040',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.5036,
      longitude: -99.5075
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Sunday'
        ],
        opens: '11:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Friday',
          'Saturday'
        ],
        opens: '11:00',
        closes: '23:00'
      }
    ],
    servesCuisine: [
      'BBQ',
      'American',
      'Mexican'
    ],
    menu: `${canonical}/menu`,
    ...schemaData
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Gorilla Smoke & Grill" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
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
      
      {/* Social Sharing Optimization */}
      <meta property="og:site_name" content="Gorilla Smoke & Grill" />
      <meta property="og:locale" content="en_US" />
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
      <meta name="business:contact_data:street_address" content="123 Main Street" />
      <meta name="business:contact_data:locality" content="Laredo" />
      <meta name="business:contact_data:region" content="TX" />
      <meta name="business:contact_data:postal_code" content="78040" />
      <meta name="business:contact_data:country_name" content="USA" />
    </Helmet>
  );
}