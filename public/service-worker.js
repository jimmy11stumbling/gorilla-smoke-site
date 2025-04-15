// Service Worker for Gorilla Smoke & Grill PWA
const CACHE_NAME = 'gorilla-smoke-grill-v1.1';
const API_CACHE_NAME = 'gorilla-smoke-grill-api-v1';
const RUNTIME_CACHE_NAME = 'gorilla-smoke-grill-runtime-v1';

// Cache expiration time (in milliseconds)
const API_CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour for API responses

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/structured-data.json',
  '/robots.txt',
  '/favicon.ico',
  '/humans.txt',
  '/icons/icon.svg',
  '/icons/icon-16x16.png',
  '/icons/icon-32x32.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/menu-192x192.png',
  '/icons/order-192x192.png',
  '/og-image.svg',
  '/og-image.png',
  '/screenshots/homepage-1280x720.jpg',
  '/screenshots/menu-1280x720.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, API_CACHE_NAME, RUNTIME_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Helper function to store API responses with expiration timestamp
const cacheAPIResponse = (request, response) => {
  const timestamp = Date.now();
  const clonedResponse = response.clone();
  
  return caches.open(API_CACHE_NAME).then(cache => {
    // Convert the response to a format where we can add a timestamp
    return clonedResponse.json().then(data => {
      // Create a new Response with the data and metadata
      const newResponse = new Response(JSON.stringify({
        data: data,
        timestamp: timestamp
      }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache-Timestamp': timestamp.toString()
        }
      });
      
      // Store the modified response in the cache
      return cache.put(request, newResponse);
    });
  });
};

// Helper function to check API cache with expiration
const getValidAPICache = (request) => {
  return caches.open(API_CACHE_NAME).then(cache => {
    return cache.match(request).then(response => {
      if (!response) return null;
      
      return response.json().then(cachedData => {
        const cachedTime = cachedData.timestamp;
        const now = Date.now();
        
        // If data is expired, return null to trigger a fresh fetch
        if (now - cachedTime > API_CACHE_EXPIRATION) {
          return null;
        }
        
        // Return a properly formatted response with just the data
        return new Response(JSON.stringify(cachedData.data), {
          headers: { 'Content-Type': 'application/json' }
        });
      });
    });
  });
};

// Fetch event - serve from cache or fetch from network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Special handling for API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      getValidAPICache(event.request)
        .then(validCachedResponse => {
          if (validCachedResponse) {
            return validCachedResponse;
          }
          
          // No valid cache, make network request
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Cache the API response for future offline use
              cacheAPIResponse(event.request, response.clone());
              return response;
            })
            .catch(() => {
              // If network fails and we have any cached version, use it
              return caches.match(event.request);
            });
        })
    );
    return;
  }
  
  // Standard caching for non-API requests
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Return the response if it's not valid or not a 200 response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for cache and browser
            const responseToCache = response.clone();
            
            caches.open(RUNTIME_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // For HTML requests, return the offline page
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// Message handling from the application
self.addEventListener('message', event => {
  // Handle messages from the application
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clearing requests
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'CACHES_CLEARED',
              timestamp: Date.now()
            });
          });
        });
      })
    );
  }
  
  // Handle API refresh requests
  if (event.data && event.data.type === 'REFRESH_API_CACHE' && event.data.url) {
    const url = event.data.url;
    event.waitUntil(
      caches.open(API_CACHE_NAME).then(cache => {
        return cache.delete(new Request(url)).then(() => {
          clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'API_CACHE_REFRESHED',
                url: url,
                timestamp: Date.now()
              });
            });
          });
        });
      })
    );
  }
});