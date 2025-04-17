import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ServiceWorkerRegistration() {
  const { toast } = useToast();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleSuccess = () => {
        console.log('Service Worker registered successfully');
      };
      
      const handleFailure = (error: any) => {
        console.error('Service Worker registration failed:', error);
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
                console.log('App has been installed and is ready for offline use');
              }
            }
          };
        };
      };

      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            handleSuccess();
            handleUpdate(registration);
          })
          .catch(handleFailure);
      });

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('New content is available');
        }
      });

      // Add a listener to refresh the page when the service worker is updated
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (newVersionAvailable) {
          window.location.reload();
        }
      });
    }
  }, [toast, newVersionAvailable, waitingWorker]);

  // This component doesn't render anything visible
  return null;
}