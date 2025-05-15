
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to check if Google Maps API is loaded
const checkGoogleMapsLoaded = () => {
  return window.google && window.google.maps;
};

// Function to load Google Maps API if it's not already loaded
const loadGoogleMapsAPI = () => {
  if (checkGoogleMapsLoaded()) {
    console.log("Google Maps API already loaded");
    renderApp();
    return;
  }

  // Try to load Google Maps API dynamically if needed
  const API_KEY = "AIzaSyBTW7cu2erQ8cX9dU6uhhTCdFgESBzODCc";
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.log("Google Maps API dynamically loaded");
    renderApp();
  };
  
  script.onerror = () => {
    console.error("Failed to load Google Maps API");
    renderApp(); // Render anyway, the app will handle the error
  };
  
  document.head.appendChild(script);
};

// Function to render the React app
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  createRoot(rootElement).render(<App />);
};

// Start the process
loadGoogleMapsAPI();
