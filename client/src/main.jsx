import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.jsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error("Google API Key is missing! Check your .env file.");
} else {
  console.log("Google Maps API Key Loaded:", GOOGLE_MAPS_API_KEY);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App googleApiKey={GOOGLE_MAPS_API_KEY} />
  </StrictMode>
);
