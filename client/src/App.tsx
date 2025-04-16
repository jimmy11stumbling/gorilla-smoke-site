import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import AdminTest from "@/pages/AdminTest";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminTest} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <SEO />
      <Router />
    </>
  );
}

export default App;
