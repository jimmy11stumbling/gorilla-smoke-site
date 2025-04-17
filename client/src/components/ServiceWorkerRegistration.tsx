import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types for service worker message handling
interface ServiceWorkerMessage {
  type: string;
  [key: string]: any;
}

// Cache information returned by service worker
interface CacheInfo {
  cacheName: string;
  size: number;
}

// Service worker status information
interface ServiceWorkerStatus {
  status: 'active' | 'installing' | 'waiting' | 'redundant' | 'error';
  version: string;
  caches: CacheInfo[];
  timestamp: string;
}

export default function ServiceWorkerRegistration() {
  const { toast } = useToast();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [offlineReady, setOfflineReady] = useState(false);
  const [swStatus, setSwStatus] = useState<ServiceWorkerStatus | null>(null);

  // Function to clear all caches - useful for troubleshooting or forced refresh
  const clearAllCaches = useCallback(() => {
    if (!navigator.serviceWorker.controller) return;
    
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHES'
    });
    
    toast({
      title: 'Cache Cleared',
      description: 'Application cache has been cleared.',
      variant: 'default',
    });
  }, [toast]);

  // Function to check service worker status
  const checkServiceWorkerStatus = useCallback(() => {
    if (!navigator.serviceWorker.controller) return;
    
    navigator.serviceWorker.controller.postMessage({
      type: 'GET_STATUS'
    });
  }, []);

  // Handle messages from service worker
  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    if (!event.data) return;
    
    const message = event.data as ServiceWorkerMessage;
    
    switch (message.type) {
      case 'CACHES_CLEARED':
        console.log('All caches cleared at:', message.timestamp);
        break;
      
      case 'CACHE_INVALIDATED':
        console.log(`Cache ${message.cacheName} invalidated:`, message.success);
        break;
      
      case 'SERVICE_WORKER_STATUS':
        console.log('Service Worker status:', message);
        // Type safely cast the message
        const statusMessage = message as unknown as ServiceWorkerStatus;
        setSwStatus(statusMessage);
        setOfflineReady(true);
        
        // When in development, show a toast with offline capability status
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: 'Offline Ready',
            description: `App can now work offline with ${statusMessage.caches.reduce((total: number, cache: CacheInfo) => total + cache.size, 0)} cached resources.`,
            variant: 'default',
            duration: 3000,
          });
        }
        break;
        
      case 'CACHE_UPDATED':
        console.log('Cache updated:', message.url);
        break;
        
      default:
        console.log('Unknown service worker message:', message);
    }
  }, [toast]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleSuccess = (registration: ServiceWorkerRegistration) => {
        console.log('Service Worker registered successfully');
        setSwRegistration(registration);
        
        // Check status 2 seconds after registration
        setTimeout(() => {
          checkServiceWorkerStatus();
        }, 2000);
      };
      
      const handleFailure = (error: any) => {
        console.error('Service Worker registration failed:', error);
        
        // Only show error in production to avoid confusing developers
        if (process.env.NODE_ENV === 'production') {
          toast({
            title: 'Offline Mode Unavailable',
            description: 'Could not enable offline capabilities. Some features may be limited.',
            variant: 'destructive',
          });
        }
      };
      
      const handleUpdate = (registration: ServiceWorkerRegistration) => {
        // When the app updates and a new service worker is installing
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New version available
                setNewVersionAvailable(true);
                setWaitingWorker(registration.waiting);
                
                toast({
                  title: 'Update Available',
                  description: 'A new version of the app is available. Refresh to update.',
                  variant: 'default',
                  action: (
                    <button 
                      className="bg-primary text-white px-4 py-2 rounded"
                      onClick={() => {
                        if (waitingWorker) {
                          waitingWorker.postMessage({ type: 'SKIP_WAITING' });
                          waitingWorker.addEventListener('statechange', (e) => {
                            if ((e.target as ServiceWorker).state === 'activated') {
                              window.location.reload();
                            }
                          });
                        }
                      }}
                    >
                      Update Now
                    </button>
                  ),
                  duration: 10000,
                });
              } else {
                // First install
                setOfflineReady(true);
                console.log('App has been installed and is ready for offline use');
              }
            }
          };
        };
      };

      // Register service worker on window load to ensure all resources are loaded first
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            handleSuccess(registration);
            handleUpdate(registration);
          })
          .catch(handleFailure);
      });

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      // Add a listener to refresh the page when the service worker is updated
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (newVersionAvailable) {
          window.location.reload();
        }
      });
      
      // Periodic status check (every 5 minutes)
      const statusInterval = setInterval(() => {
        checkServiceWorkerStatus();
      }, 5 * 60 * 1000);
      
      return () => {
        clearInterval(statusInterval);
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, [toast, newVersionAvailable, waitingWorker, handleServiceWorkerMessage, checkServiceWorkerStatus]);

  // Expose functions to window for debugging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window.__swUtils = {
        clearAllCaches,
        checkServiceWorkerStatus,
        getStatus: () => swStatus,
        getRegistration: () => swRegistration,
        isOfflineReady: () => offlineReady,
      };
    }
  }, [clearAllCaches, checkServiceWorkerStatus, swStatus, swRegistration, offlineReady]);

  // This component doesn't render anything visible
  return null;
}