import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";
import LocationHeader from "@/components/LocationHeader";

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
      {/* Location header is now null to completely remove it */}
      <LocationHeader />
      <Router />
      <Toaster />
    </>
  );
}

export default App;
