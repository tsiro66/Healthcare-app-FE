import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorPage/ErrorBoundary";
import ErrorPage from "./components/ErrorPage/ErrorPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={ErrorPage}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
