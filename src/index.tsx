// import { StrictMode } from "react";

import React from "react";
import { PrimeReactProvider } from "primereact/api";
import WelcomePage from "./components/welcomePage";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "primeicons/primeicons.css";
import "./App.css";

const RootComponent = () => {
  return (
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<RootComponent />);

const containerStyle = {
  display: "flex",
};
