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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SafeHome() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}

function SafeRouter() {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={SafeHome} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SEO />
      <ServiceWorkerRegistration />
      <SimpleSEOMonitor />
      <ErrorBoundary>
        <AnalyticsProvider>
          <ErrorBoundary>
            <LocationProvider>
              <ErrorBoundary>
                <ReservationProvider>
                  <SafeRouter />
                  <Toaster />
                </ReservationProvider>
              </ErrorBoundary>
            </LocationProvider>
          </ErrorBoundary>
        </AnalyticsProvider>
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;
