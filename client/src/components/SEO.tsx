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
  title = 'Gorilla Smoke & Grill | Best Food in Laredo | BBQ Restaurant & Tex-Mex | Where to Eat | Great Lunch & Dinner',
  description = 'Looking for the best place to eat in Laredo? Experience award-winning BBQ at Gorilla Smoke & Grill! Savor our authentic smoked brisket, fall-off-the-bone ribs, and flame-grilled specialties that locals rave about. Perfect for date night, family dinner, or quick lunch in Laredo. Our menu has something for everyone - from juicy burgers to Tex-Mex fusion dishes. Family-owned restaurant featuring championship BBQ recipes, affordable prices, great happy hour deals, outdoor seating, and convenient parking. Open daily with lunch specials and weekend events. Order online for delivery or takeout. Visit today for an unforgettable meal in Laredo!',
  canonical = 'https://gorillasmokegrill.com',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'BBQ, Laredo restaurant, Texas barbecue, Gorilla Smoke & Grill, flame-grilled, smoking, grilling, catering, private chef, Mexican American fusion, best BBQ in Laredo, smoked brisket, pulled pork, BBQ ribs, grilled chicken, family restaurant, authentic barbecue, BBQ competition winners, weekend BBQ, Laredo dining, Laredo food, Tex-Mex BBQ, food near me, restaurant near me, group dining Laredo, catering service Laredo, private events Laredo, Mexican BBQ, American BBQ, food truck Laredo, outdoor dining, takeout BBQ, delivery food Laredo, BBQ specials, weekend brunch, happy hour Laredo, craft beer BBQ, smoked meats, Laredo event catering, best restaurant Laredo, where to eat in Laredo, good food Laredo, best dinner Laredo, Laredo restaurants open now, top places to eat Laredo, best lunch Laredo, family dining Laredo, Laredo best food, date night restaurants Laredo, Laredo lunch spots, Laredo dinner places, tasty food Laredo, places to eat downtown Laredo, best meat Laredo, affordable restaurants Laredo, Laredo local restaurants, best value restaurants Laredo, Laredo eats, Laredo food scene, hidden gems Laredo, popular restaurants Laredo, must-try restaurants Laredo, unique dining Laredo, Laredo food lovers, food deals Laredo, best steaks Laredo, best burgers Laredo, Laredo favorite restaurants, kid-friendly restaurants Laredo, business lunch Laredo, Sunday brunch Laredo, Laredo food delivery, quick bites Laredo, Laredo comfort food, homestyle cooking Laredo, authentic Tex-Mex Laredo, best tacos Laredo, Laredo Mexican food, best margaritas Laredo, happy hour deals Laredo, Laredo food specials, weekend dining Laredo, restaurants with outdoor seating Laredo, Laredo patio dining, restaurants with parking Laredo, restaurants near me, dinner ideas Laredo, healthy food options Laredo, gluten-free Laredo, vegetarian options Laredo, Laredo beer selection, craft cocktails Laredo, something good to eat in Laredo, Laredo dining deals, Laredo restaurant week, lunch specials Laredo, birthday dinner Laredo, anniversary dinner Laredo, graduation celebration Laredo, best fries Laredo, Laredo takeout, curbside pickup Laredo, party catering Laredo, large group dining Laredo, Laredo live music restaurants, Laredo food trucks, late night food Laredo, Laredo breakfast, Laredo brunch spots, famous restaurants Laredo, award-winning restaurants Laredo, cheap eats Laredo, fine dining Laredo, casual dining Laredo, Laredo sports bar, watch sports Laredo, Laredo restaurant with TVs, Laredo airport restaurants, restaurants near Laredo mall, restaurants near Laredo university, restaurants north Laredo, downtown Laredo restaurants, south Laredo food, east Laredo restaurants, west Laredo dining',
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
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: '3910 E Del Mar',
        addressLocality: 'Laredo',
        addressRegion: 'TX',
        postalCode: '78041',
        addressCountry: 'US',
        telephone: '956-568-0744'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '608 Zapata Hwy',
        addressLocality: 'Laredo',
        addressRegion: 'TX',
        postalCode: '78043',
        addressCountry: 'US',
        telephone: '956-568-1450'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '3301 San Bernardo Ave',
        addressLocality: 'Laredo',
        addressRegion: 'TX',
        postalCode: '78040',
        addressCountry: 'US',
        telephone: '956-415-6011'
      }
    ],
    location: [
      {
        '@type': 'Place',
        name: 'Gorilla Smoke & Grill - E Del Mar',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '3910 E Del Mar',
          addressLocality: 'Laredo',
          addressRegion: 'TX',
          postalCode: '78041',
          addressCountry: 'US'
        },
        telephone: '956-568-0744',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.5431,
          longitude: -99.4502
        }
      },
      {
        '@type': 'Place',
        name: 'Gorilla Smoke & Grill - Zapata Hwy',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '608 Zapata Hwy',
          addressLocality: 'Laredo',
          addressRegion: 'TX',
          postalCode: '78043',
          addressCountry: 'US'
        },
        telephone: '956-568-1450',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.5008,
          longitude: -99.5071
        }
      },
      {
        '@type': 'Place',
        name: 'Gorilla Smoke & Grill - San Bernardo',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '3301 San Bernardo Ave',
          addressLocality: 'Laredo',
          addressRegion: 'TX',
          postalCode: '78040',
          addressCountry: 'US'
        },
        telephone: '956-415-6011',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.5307,
          longitude: -99.5036
        }
      }
    ],
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
      
      {/* Alternate Language Versions */}
      <link rel="alternate" href="https://gorillasmokegrill.com" hrefLang="en-us" />
      <link rel="alternate" href="https://gorillasmokegrill.com/es" hrefLang="es-us" />
      <link rel="alternate" href="https://gorillasmokegrill.com/es-mx" hrefLang="es-mx" />
      <link rel="alternate" href="https://gorillasmokegrill.com" hrefLang="x-default" />
      
      {/* Local Business Markup - E Del Mar Location */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta property="place:location:latitude" content="27.5431" />
      <meta property="place:location:longitude" content="-99.4502" />
      <meta property="restaurant:contact_info:website" content="https://gorillasmokegrill.com" />
      <meta property="restaurant:contact_info:street_address" content="3910 E Del Mar" />
      <meta property="restaurant:contact_info:locality" content="Laredo" />
      <meta property="restaurant:contact_info:region" content="TX" />
      <meta property="restaurant:contact_info:postal_code" content="78041" />
      <meta property="restaurant:contact_info:country_name" content="United States" />
      <meta property="restaurant:contact_info:email" content="info@gorillasmokegrill.com" />
      <meta property="restaurant:contact_info:phone_number" content="956-568-0744" />
      <meta property="restaurant:serves_cuisine" content="BBQ, American, Tex-Mex" />
      <meta property="restaurant:price_range" content="$$" />
      <meta property="restaurant:opening_hours" content="Mo-Su 11:00-22:00" />
    </Helmet>
  );
}