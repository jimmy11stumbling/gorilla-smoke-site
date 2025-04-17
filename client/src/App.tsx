import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Toaster } from "@/components/ui/toaster";
import { LocationProvider } from "@/contexts/LocationContext";
import { ReservationProvider } from "@/contexts/ReservationContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SimpleSEOMonitor from "@/components/SimpleSEOMonitor";
import ErrorBoundary from "@/components/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { lazy, Suspense } from "react";

// Lazy load the Home component to improve initial load time
// const LazyHome = lazy(() => import("@/pages/Home"));

// Simple router without nested error boundaries
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    // Single error boundary at the root level
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Non-visual components */}
        <SEO />
        <ServiceWorkerRegistration />
        <SimpleSEOMonitor />
        
        {/* Context providers with a single shared error boundary */}
        <AnalyticsProvider>
          <LocationProvider>
            <ReservationProvider>
              <Router />
              <Toaster />
            </ReservationProvider>
          </LocationProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
