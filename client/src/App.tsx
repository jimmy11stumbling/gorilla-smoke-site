import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Toaster } from "@/components/ui/toaster";
import { LocationProvider } from "@/contexts/LocationContext";
import { ReservationProvider } from "@/contexts/ReservationContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";

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
    <>
      <SEO />
      <ServiceWorkerRegistration />
      <AnalyticsProvider>
        <LocationProvider>
          <ReservationProvider>
            <Router />
            <Toaster />
          </ReservationProvider>
        </LocationProvider>
      </AnalyticsProvider>
    </>
  );
}

export default App;
