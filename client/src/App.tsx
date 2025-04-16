import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import AdminBasic from "@/pages/AdminBasic";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminBasic} />
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
