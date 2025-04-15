// Service worker registration helper for production readiness

// Register the service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service worker registered successfully:', registration.scope);
          
          // Check for updates - do this periodically
          checkForUpdates(registration);
          
          // Set up an interval to check for updates
          setInterval(() => checkForUpdates(registration), 1000 * 60 * 60); // Check hourly
        })
        .catch(error => {
          console.error('Service worker registration failed:', error);
        });
    });
    
    // Listen for updates from the service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'CACHES_CLEARED') {
        console.log('All caches cleared successfully at', new Date(event.data.timestamp).toLocaleTimeString());
      }
      
      if (event.data && event.data.type === 'API_CACHE_REFRESHED') {
        console.log('API cache refreshed for', event.data.url, 'at', new Date(event.data.timestamp).toLocaleTimeString());
      }
    });
  }
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