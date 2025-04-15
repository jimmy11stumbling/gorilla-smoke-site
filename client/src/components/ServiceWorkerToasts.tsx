import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UpdateButton } from './UpdateButton';

// This component manages showing service worker related toasts
export function ServiceWorkerToasts() {
  const { toast } = useToast();

  useEffect(() => {
    // Handle new content available
    function handleNewContentAvailable() {
      toast({
        title: "App update available",
        description: "A new version is available. Refresh to update.",
        action: <UpdateButton />,
        duration: 0 // No auto-dismiss
      });
    }

    // Handle offline ready
    function handleOfflineReady() {
      toast({
        title: "Ready for offline use",
        description: "This app will work even when you're offline",
        duration: 3000,
      });
    }

    // Handle cache cleared
    function handleCacheCleared() {
      toast({
        title: "Cache cleared",
        description: "All app data has been refreshed",
        duration: 3000,
      });
    }

    // Handle offline mode
    function handleOfflineMode() {
      toast({
        title: "You're offline",
        description: "The app will continue to work with limited functionality",
        variant: "destructive",
        duration: 5000,
      });
    }

    // Register event listeners
    window.addEventListener('swNewContentAvailable', handleNewContentAvailable);
    window.addEventListener('swOfflineReady', handleOfflineReady);
    window.addEventListener('swCacheCleared', handleCacheCleared);
    window.addEventListener('swOfflineMode', handleOfflineMode);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('swNewContentAvailable', handleNewContentAvailable);
      window.removeEventListener('swOfflineReady', handleOfflineReady);
      window.removeEventListener('swCacheCleared', handleCacheCleared);
      window.removeEventListener('swOfflineMode', handleOfflineMode);
    };
  }, [toast]);

  // This is a headless component, so it doesn't render anything
  return null;
}