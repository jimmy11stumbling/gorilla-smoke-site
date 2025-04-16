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
  title = 'Gorilla Smoke & Grill | #1 Tex-Mex BBQ Fusion in Laredo | Smoked Brisket Tacos & Unique Grill Specialties',
  description = 'Discover the ONLY authentic Tex-Mex BBQ fusion in Laredo at Gorilla Smoke & Grill! Our signature smoked brisket tacos, flame-grilled fajitas, and mesquite-smoked specialties combine traditional Texas BBQ with bold Mexican flavors. Family-owned with championship-winning recipes and three convenient Laredo locations. Perfect for everything from casual lunches to special celebrations. Our unique menu features innovative creations like brisket quesadillas, smoked carnitas, and BBQ street tacos that you won\'t find anywhere else. Order online through UberEats, DoorDash, or GrubHub for delivery to your door. Experience the irresistible flavor fusion that has all of Laredo talking!',
  canonical = 'https://gorillasmokegrill.com',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'Tex-Mex BBQ fusion, smoked brisket tacos, BBQ street tacos, Laredo best restaurant, Gorilla Smoke & Grill, mesquite-smoked meats, brisket quesadillas, smoked carnitas, flame-grilled fajitas, Mexican BBQ fusion, unique Laredo food, Texas BBQ with Mexican flavors, best tacos in Laredo, authentic smoked meats, championship BBQ recipes, BBQ fusion cuisine, Laredo authentic BBQ, Tex-Mex food, Mexican-inspired BBQ, smoked meats Laredo, BBQ restaurant Laredo, Gorilla BBQ, family restaurant Laredo, Laredo dining, best dinner Laredo, Laredo restaurants, places to eat in Laredo, Laredo food scene, restaurants near me, food delivery Laredo, UberEats Laredo, DoorDash Laredo, GrubHub Laredo, best BBQ restaurants, best Mexican food Laredo, Del Mar restaurants, Zapata Hwy restaurants, San Bernardo Ave restaurants, Laredo outdoor dining, Laredo restaurant with bar, kid-friendly restaurants Laredo, Laredo group dining, signature BBQ dishes, slow-smoked meats, craft cocktails Laredo, local Laredo restaurants, family dining Laredo, top-rated Laredo restaurant, best value restaurants Laredo, specialty BBQ, authentic Tex-Mex, homestyle cooking Laredo, lunch spots Laredo, popular Laredo restaurants, comida mexicana Laredo, restaurantes Laredo, smokehouse Laredo, award-winning BBQ, fall-off-the-bone ribs, char-grilled burgers, fresh-made tortillas, homemade BBQ sauce, spicy BBQ, sweet and smoky BBQ, BBQ lunch specials, Laredo date night restaurant, casual dining Laredo, Laredo food with a twist, innovative Mexican food, creative BBQ, signature smoked brisket, chef-crafted menu, gourmet BBQ, house specialties, traditional BBQ with a twist, must-try Laredo restaurant, Laredo hidden gem restaurant, best-kept secret Laredo food, local favorite restaurant, Laredo flavor fusion, donde comer en Laredo, authentic food Laredo, unique dining experience, three convenient locations, party catering Laredo, special events dining',
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
    servesCuisine: ['Tex-Mex BBQ Fusion', 'Mexican BBQ', 'Texas BBQ', 'Smoked Meats', 'Mexican-American Fusion'],
    menu: `${canonical}/menu`,
    acceptsReservations: 'Yes',
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Tex-Mex BBQ Starters',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'BBQ Nachos Supreme',
              description: 'Homemade tortilla chips loaded with smoked brisket, queso, guacamole, sour cream, and jalapeños',
              offers: {
                '@type': 'Offer',
                price: '14.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'Smoked Queso Fundido',
              description: 'Melted queso with chorizo, smoked peppers, and homemade chips',
              offers: {
                '@type': 'Offer',
                price: '12.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'Fire Grilled Wings',
              description: 'Wings grilled to perfection with our signature spice blend',
              offers: {
                '@type': 'Offer',
                price: '13.99',
                priceCurrency: 'USD'
              }
            }
          ]
        },
        {
          '@type': 'MenuSection',
          name: 'Signature Fusion Tacos',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Smoked Brisket Tacos',
              description: 'House-smoked brisket in fresh corn tortillas with cilantro-lime slaw and chipotle aioli',
              offers: {
                '@type': 'Offer',
                price: '15.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'Mesquite Grilled Fajita Tacos',
              description: 'Choice of steak or chicken with grilled peppers, onions, and homemade salsa',
              offers: {
                '@type': 'Offer',
                price: '16.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'BBQ Carnitas Street Tacos',
              description: 'Slow-smoked pulled pork in authentic street-style tortillas with traditional garnishes',
              offers: {
                '@type': 'Offer',
                price: '14.99',
                priceCurrency: 'USD'
              }
            }
          ]
        },
        {
          '@type': 'MenuSection',
          name: 'BBQ Fusion Specialties',
          hasMenuItem: [
            {
              '@type': 'MenuItem',
              name: 'Smoked Brisket Quesadilla',
              description: 'Tender smoked brisket with melted Monterey Jack and cheddar cheeses in a flour tortilla',
              offers: {
                '@type': 'Offer',
                price: '18.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'Texas BBQ Ribs',
              description: 'Fall-off-the-bone pork ribs with our house chipotle-infused BBQ sauce',
              offers: {
                '@type': 'Offer',
                price: '23.99',
                priceCurrency: 'USD'
              }
            },
            {
              '@type': 'MenuItem',
              name: 'Smoked Brisket Enchiladas',
              description: 'Slow-smoked brisket wrapped in corn tortillas, topped with our signature BBQ mole sauce',
              offers: {
                '@type': 'Offer',
                price: '19.99',
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
        reviewBody: 'The best Tex-Mex BBQ fusion in Laredo! Their smoked brisket tacos are incredible, and the BBQ nachos supreme are a must-try. Truly unique flavors you won\'t find anywhere else.'
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
        reviewBody: 'Absolutely the best fusion of Mexican flavors and Texas BBQ in Laredo! The brisket quesadillas are to die for, and their mesquite-grilled fajita tacos have the perfect smoky kick. A true Laredo original that combines the best of both cuisines!'
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
      
      {/* Hreflang Tags for International SEO */}
      <link rel="alternate" href="https://gorillasmokegrill.com" hrefLang="en-us" />
      <link rel="alternate" href="https://gorillasmokegrill.com/es" hrefLang="es-mx" />
      <link rel="alternate" href="https://gorillasmokegrill.com" hrefLang="x-default" />
      
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
      
      {/* Google Business Profile Optimization */}
      <meta name="google" content="notranslate" />
      <meta name="google-site-verification" content="your-verification-code" />
      <meta property="business:contact_data:phone_number" content="956-568-0744" />
      <meta property="business:contact_data:website" content="https://gorillasmokegrill.com" />
      <meta property="place:location:latitude" content="27.5431" />
      <meta property="place:location:longitude" content="-99.4502" />
      <meta property="business:hours:day" content="monday 11:00-22:00" />
      <meta property="business:hours:day" content="tuesday 11:00-22:00" />
      <meta property="business:hours:day" content="wednesday 11:00-22:00" />
      <meta property="business:hours:day" content="thursday 11:00-22:00" />
      <meta property="business:hours:day" content="friday 11:00-22:00" />
      <meta property="business:hours:day" content="saturday 11:00-22:00" />
      <meta property="business:hours:day" content="sunday 11:00-22:00" />
      
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
      <meta property="restaurant:serves_cuisine" content="Tex-Mex BBQ Fusion, Mexican BBQ, Texas BBQ, Smoked Meats" />
      <meta property="restaurant:price_range" content="$$" />
      <meta property="restaurant:opening_hours" content="Mo-Su 11:00-22:00" />
    </Helmet>
  );
}