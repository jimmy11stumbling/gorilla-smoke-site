// Service Worker for Gorilla Smoke & Grill PWA
const CACHE_NAME = 'gorilla-smoke-grill-v2';
const ASSETS_CACHE = 'gorilla-assets-v2';
const API_CACHE = 'gorilla-api-v2';

// Assets to cache on install - critical for initial page load
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/structured-data.json',
  '/icons/icon.svg',
  '/og-image.svg',
  '/images/restaurant-exterior.jpg',
  '/images/restaurant-interior.jpg',
  '/images/bbq-specialties.jpg'
];

// Additional assets to cache during runtime
const RUNTIME_CACHE_URLS = [
  /\.(?:js|css)$/,  // JavaScript and CSS files
  /\.(?:png|jpg|jpeg|svg|webp|gif)$/  // Images
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

// Add message handler for cache control and status reporting
self.addEventListener('message', event => {
  if (event.data && event.data.type) {
    // Handle cache invalidation requests
    if (event.data.type === 'CLEAR_CACHES') {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              console.log(`Clearing cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
          ).then(() => {
            // Notify client that caches were cleared
            if (event.source) {
              event.source.postMessage({
                type: 'CACHES_CLEARED',
                timestamp: new Date().toISOString()
              });
            }
          });
        })
      );
    }
    
    // Handle specific cache invalidation
    else if (event.data.type === 'INVALIDATE_CACHE' && event.data.cacheName) {
      event.waitUntil(
        caches.delete(event.data.cacheName).then(success => {
          if (event.source) {
            event.source.postMessage({
              type: 'CACHE_INVALIDATED',
              cacheName: event.data.cacheName,
              success: success
            });
          }
        })
      );
    }
    
    // Handle status check requests
    else if (event.data.type === 'GET_STATUS') {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              return caches.open(cacheName).then(cache => {
                return cache.keys().then(keys => ({
                  cacheName,
                  size: keys.length
                }));
              });
            })
          ).then(cacheInfos => {
            if (event.source) {
              event.source.postMessage({
                type: 'SERVICE_WORKER_STATUS',
                status: 'active',
                version: CACHE_NAME,
                caches: cacheInfos,
                timestamp: new Date().toISOString()
              });
            }
          });
        })
      );
    }
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, ASSETS_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        console.log('Deleting old cache:', cacheToDelete);
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Helper function to check if a URL matches any pattern in the list
function matchesPattern(url, patterns) {
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  return patterns.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(path);
    }
    return path.includes(pattern);
  });
}

// Fetch event with improved caching strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  const url = new URL(event.request.url);
  
  // Handle API requests - network first with timed cache for selected endpoints
  if (url.pathname.startsWith('/api/')) {
    // Only cache some API endpoints that change infrequently
    if (
      url.pathname.includes('/api/menu') || 
      url.pathname.includes('/api/delivery-services')
    ) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(API_CACHE).then(cache => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
    }
    return; // For other API requests, let the browser handle them normally
  }
  
  // For HTML pages - network first, fallback to cache
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not found in cache, return the main index page
              return caches.match('/');
            });
        })
    );
    return;
  }
  
  // For static assets like JS, CSS, images - cache first, fallback to network
  if (matchesPattern(event.request.url, RUNTIME_CACHE_URLS)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Return cached response but also update cache in background
            fetch(event.request)
              .then(response => {
                if (response && response.status === 200) {
                  caches.open(ASSETS_CACHE).then(cache => {
                    cache.put(event.request, response);
                  });
                }
              })
              .catch(() => {/* Ignore network errors */});
              
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              const responseToCache = response.clone();
              caches.open(ASSETS_CACHE).then(cache => {
                cache.put(event.request, responseToCache);
              });
              
              return response;
            });
        })
    );
    return;
  }
  
  // Default strategy for other requests - network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});