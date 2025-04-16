import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Toaster } from "@/components/ui/toaster";
import { LocationProvider } from "@/contexts/LocationContext";
import { ReservationProvider } from "@/contexts/ReservationContext";

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
      <LocationProvider>
        <ReservationProvider>
          <Router />
          <Toaster />
        </ReservationProvider>
      </LocationProvider>
    </>
  );
}

export default App;
