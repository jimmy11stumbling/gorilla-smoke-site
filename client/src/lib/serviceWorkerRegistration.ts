// Service worker registration helper for production readiness

// Custom event names for service worker events
export const SERVICE_WORKER_EVENTS = {
  NEW_CONTENT: 'swNewContentAvailable',
  OFFLINE_READY: 'swOfflineReady',
  CACHE_CLEARED: 'swCacheCleared',
  OFFLINE_MODE: 'swOfflineMode',
  API_REFRESHED: 'swApiRefreshed'
};

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Register the service worker with enhanced error handling and user notifications
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Wait until window load event to avoid competing for resources during page load
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      if (isLocalhost) {
        // This is running on localhost. Check if service worker still exists and is valid
        checkValidServiceWorker(swUrl);
      } else {
        // Not localhost. Just register service worker
        registerValidSW(swUrl);
      }
    });
    
    // Set up message listener for service worker communication
    setupServiceWorkerMessageListener();
  } else {
    console.log('Service workers are not supported in this browser');
  }
}

function registerValidSW(swUrl: string) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // Successfully registered service worker
      console.log('Service worker registered successfully:', registration.scope);
      
      // Check for updates immediately and setup periodic checks
      checkForUpdates(registration);
      setInterval(() => checkForUpdates(registration), 1000 * 60 * 60); // Check hourly
      
      // Handle service worker updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched
              console.log('New content is available and will be used when the page is reloaded.');
              
              // Dispatch event for new content
              window.dispatchEvent(new CustomEvent(SERVICE_WORKER_EVENTS.NEW_CONTENT));
            } else {
              // At this point, everything has been precached.
              console.log('Content is cached for offline use.');
              
              // Dispatch event for offline ready
              window.dispatchEvent(new CustomEvent(SERVICE_WORKER_EVENTS.OFFLINE_READY));
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string) {
  // Check if the service worker can be found
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Ensure service worker exists, and that we really get a JS file
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      
      // Dispatch event for offline mode
      window.dispatchEvent(new CustomEvent(SERVICE_WORKER_EVENTS.OFFLINE_MODE));
    });
}

function setupServiceWorkerMessageListener() {
  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHES_CLEARED') {
      console.log('All caches cleared successfully at', new Date(event.data.timestamp).toLocaleTimeString());
      
      // Dispatch event for cache cleared
      window.dispatchEvent(new CustomEvent(SERVICE_WORKER_EVENTS.CACHE_CLEARED));
    }
    
    if (event.data && event.data.type === 'API_CACHE_REFRESHED') {
      console.log('API cache refreshed for', event.data.url, 'at', new Date(event.data.timestamp).toLocaleTimeString());
      
      // Dispatch event for API cache refreshed
      window.dispatchEvent(new CustomEvent(SERVICE_WORKER_EVENTS.API_REFRESHED, {
        detail: { url: event.data.url }
      }));
    }
    
    if (event.data && event.data.type === 'OFFLINE_READY') {
      // Dispatch event for offline ready
      window.dispatchEvent(new CustomEvent(SERVICE_WORKER_EVENTS.OFFLINE_READY));
    }
  });
}

// Check for service worker updates
function checkForUpdates(registration: ServiceWorkerRegistration) {
  registration.update()
    .then(() => {
      // If there's a new service worker waiting, notify the user or activate it
      if (registration.waiting) {
        console.log('New service worker available');
        // You could show a toast notification here asking user to refresh
      }
    })
    .catch(error => {
      console.error('Error checking for service worker updates:', error);
    });
}

// Clear all caches
export function clearAllCaches() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHES'
    });
  }
}

// Refresh a specific API cache
export function refreshAPICache(url: string) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'REFRESH_API_CACHE',
      url
    });
  }
}

// You can call this when the user clicks a refresh button
export function skipWaiting() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SKIP_WAITING'
    });
  }
}