import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { CartProvider } from "@/lib/cart-context";
import SEO from "@/components/SEO";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load page components
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-foreground">Loading...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
