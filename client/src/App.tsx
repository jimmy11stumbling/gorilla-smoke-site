import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy, useCallback } from "react";
import { CartProvider } from "@/lib/cart-context";
import SEO from "@/components/SEO";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ServiceWorkerToasts } from "@/components/ServiceWorkerToasts";
import { ErrorFallback } from "@/components/ErrorFallback";
import AudioAmbianceControl from "@/components/AudioAmbianceControl";
import OrderNotifications from "@/components/OrderNotifications";

// Lazy load page components for code splitting
const Home = lazy(() => import("@/pages/Home"));
const StaffView = lazy(() => import("@/pages/StaffView"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" 
           role="status" aria-label="Loading">
      </div>
      <p className="mt-4 text-lg text-foreground">Loading...</p>
    </div>
  </div>
);

// Router component handling route definitions and lazy loading
function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/staff" component={StaffView} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

/**
 * Main App component that sets up:
 * - Error boundaries for graceful error handling
 * - Cart provider for state management
 * - SEO configuration
 * - Router for navigation
 * - Toast notifications
 * - Service worker notifications
 */
function App() {
  // Global error handler for logging
  const handleError = useCallback((error: Error, info: React.ErrorInfo | { componentStack: string }) => {
    // Log to console in development
    console.error("Global error caught:", error);
    console.error("Component stack:", 'componentStack' in info ? info.componentStack : info);
    
    // In production, you would log to an error tracking service like Sentry
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error);
    }
  }, []);

  return (
    <ErrorBoundary onError={handleError}>
      <CartProvider>
        <SEO />
        <Router />
        <AudioAmbianceControl />
        <OrderNotifications />
        <Toaster />
        <ServiceWorkerToasts />
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
