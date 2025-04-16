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
  title = 'Gorilla Smoke & Grill | Best BBQ & Smoked Meats in Laredo, TX | Award-Winning Restaurant',
  description = 'Experience award-winning BBQ at Gorilla Smoke & Grill in Laredo, TX! Savor our authentic smoked brisket, fall-off-the-bone ribs, and flame-grilled specialties. Family-owned restaurant featuring championship BBQ recipes, catering services for events, weekend specials, and unforgettable private chef experiences. Visit today for the best barbecue in Laredo!',
  canonical = 'https://gorillasmokegrill.com',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'BBQ, Laredo restaurant, Texas barbecue, Gorilla Smoke & Grill, flame-grilled, smoking, grilling, catering, private chef, Mexican American fusion, best BBQ in Laredo, smoked brisket, pulled pork, BBQ ribs, grilled chicken, family restaurant, authentic barbecue, BBQ competition winners, weekend BBQ, Laredo dining, Laredo food, Tex-Mex BBQ, food near me, restaurant near me, group dining Laredo, catering service Laredo, private events Laredo, Mexican BBQ, American BBQ, food truck Laredo, outdoor dining, takeout BBQ, delivery food Laredo, BBQ specials, weekend brunch, happy hour Laredo, craft beer BBQ, smoked meats, Laredo event catering, best restaurant Laredo',
  schemaData,
}: SEOProps) {
  // Local business schema for restaurant with enhanced details
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Gorilla Smoke & Grill',
    alternateName: 'Gorilla BBQ',
    description: description,
    image: [
      `${canonical}/images/restaurant-exterior.jpg`,
      `${canonical}/images/restaurant-interior.jpg`,
      `${canonical}/images/bbq-specialties.jpg`,
      ogImage
    ],
    '@id': canonical,
    url: canonical,
    telephone: '+1-555-123-4567',
    email: 'info@gorillasmokegrill.com',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        opens: '11:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '11:00',
        closes: '23:00'
      }
    ],
    servesCuisine: ['BBQ', 'American', 'Mexican', 'Tex-Mex', 'Smoked Meats'],
    menu: `${canonical}/menu`,
    acceptsReservations: 'Yes',
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Starters',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Fire Grilled Wings',
              description: 'Wings grilled to perfection with our signature spice blend',
              offers: {
                '@type': 'Offer',
                price: '12.99',
                priceCurrency: 'USD'
              }
            }
          ]
        },
        {
          '@type': 'MenuSection',
          name: 'BBQ Specialties',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Smoked Brisket',
              description: 'Slow-smoked for 12 hours with our signature rub',
              offers: {
                '@type': 'Offer',
                price: '18.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'BBQ Ribs',
              description: 'Fall-off-the-bone pork ribs with our house BBQ sauce',
              offers: {
                '@type': 'Offer',
                price: '21.99',
                priceCurrency: 'USD'
              }
            }
          ]
        }
      ]
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'John D.'
        },
        datePublished: '2023-04-15',
        reviewBody: 'Best BBQ in Laredo! The brisket melts in your mouth and the ribs are fall-off-the-bone good.'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Maria S.'
        },
        datePublished: '2023-06-22',
        reviewBody: 'Incredible flavors and friendly service. Their smoked meats are unbeatable!'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '256'
    },
    paymentAccepted: 'Cash, Credit Card, Apple Pay, Google Pay',
    smokingAllowed: false,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Outdoor Seating', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wheelchair Accessible', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Full Bar', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Takeout', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true }
    ],
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${canonical}/reservations`,
        inLanguage: 'en-US',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/IOSPlatform',
          'http://schema.org/AndroidPlatform'
        ]
      },
      result: {
        '@type': 'Reservation',
        name: 'Restaurant Reservation'
      }
    },
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