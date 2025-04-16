import React from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryProvider } from "./lib/reactQuerySetup";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

// Wrap the application with the React Query provider
root.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </React.StrictMode>
);
