// Service Worker for Gorilla Smoke & Grill PWA
const CACHE_NAME = 'gorilla-smoke-grill-v4';

// Only static image/icon assets — never JS, CSS, or HTML
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon.svg',
  '/og-image.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);

  // Never cache API calls, Vite HMR, JS bundles, CSS, or HTML —
  // only cache image/font files so the app always loads fresh code.
  const ext = url.pathname.split('.').pop() || '';
  const skipExtensions = ['js', 'ts', 'jsx', 'tsx', 'css', 'html', 'map'];
  if (
    url.pathname.includes('/api/')      ||
    url.pathname.includes('/@')         ||
    url.pathname.includes('/node_modules') ||
    url.searchParams.has('t')           ||
    skipExtensions.includes(ext)
  ) return;

  // For images and static media — cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {});
    })
  );
});
