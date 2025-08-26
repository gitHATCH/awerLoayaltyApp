import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css';
import { CompanyProvider } from './context/CompanyContext';
import { PointsConfigProvider } from './context/PointsConfigContext';

createRoot(document.getElementById("root")!).render(
  <CompanyProvider>
    <PointsConfigProvider>
      <App />
    </PointsConfigProvider>
  </CompanyProvider>
);
