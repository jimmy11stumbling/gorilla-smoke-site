import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/lib/cart-context";
import SEO from "@/components/SEO";
import ErrorBoundary from "@/components/ErrorBoundary";

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
    <ErrorBoundary>
      <CartProvider>
        <SEO />
        <Router />
        <Toaster />
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
