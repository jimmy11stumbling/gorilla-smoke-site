import { Switch, Route } from "wouter";

// Super simple component with no hooks or dependencies
const Home = () => <div>Home Page</div>;
const Admin = () => <div>Admin Page</div>;
const NotFound = () => <div>Not Found</div>;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;