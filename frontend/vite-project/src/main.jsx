import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary"; 
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
      <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);



