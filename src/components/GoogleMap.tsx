
import React, { useEffect, useRef, useState } from "react";

// Declare Google Maps types properly
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  height?: string;
  onMarkerClick?: (marker: any) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 18.5204, lng: 73.8567 }, // Default to Pune, India
  zoom = 12,
  markers = [],
  height = "400px",
  onMarkerClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [infoWindow, setInfoWindow] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Check if Google Maps API is loaded
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const loadTimer = setInterval(() => {
        console.log("Checking if Google Maps API is loaded...");
        if (window.google && window.google.maps) {
          console.log("Google Maps API loaded successfully!");
          setIsLoaded(true);
          clearInterval(loadTimer);
        }
      }, 1000);
      
      // Set a timeout to stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(loadTimer);
        if (!isLoaded) {
          console.error("Google Maps API failed to load within timeout");
          setLoadError("Google Maps API failed to load. Please check your internet connection and try again.");
        }
      }, 10000);
      
      return () => {
        clearInterval(loadTimer);
      };
    } else {
      console.log("Google Maps API was already loaded!");
      setIsLoaded(true);
    }
  }, []);

  // Initialize map when API is loaded and component is mounted
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    try {
      console.log("Initializing Google Map...");
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
      });

      setMap(mapInstance);
      setInfoWindow(new window.google.maps.InfoWindow());
      console.log("Google Map initialized successfully!");
    } catch (error) {
      console.error("Error initializing Google Map:", error);
      setLoadError(`Failed to initialize map: ${error instanceof Error ? error.message : String(error)}`);
    }

    return () => {
      setMap(null);
      setInfoWindow(null);
    };
  }, [mapRef, isLoaded, center, zoom]);

  // Handle markers when map is ready
  useEffect(() => {
    if (!map || !infoWindow || !isLoaded) return;

    // Clear existing markers
    map.setCenter(center);
    
    // Add markers
    markers.forEach((markerInfo) => {
      try {
        const marker = new window.google.maps.Marker({
          position: markerInfo.position,
          map,
          title: markerInfo.title,
          animation: window.google.maps.Animation.DROP,
        });

        if (markerInfo.info) {
          marker.addListener("click", () => {
            if (infoWindow) {
              infoWindow.setContent(`<div class="p-2"><h3 class="font-semibold">${markerInfo.title}</h3><p>${markerInfo.info}</p></div>`);
              infoWindow.open(map, marker);
            }
            if (onMarkerClick) {
              onMarkerClick(markerInfo);
            }
          });
        }
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });
  }, [map, markers, center, infoWindow, onMarkerClick, isLoaded]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: "100%" }} 
        className="rounded-md"
      >
        {!isLoaded && !loadError && (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blood mb-2"></div>
              <p className="text-sm text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )}
        
        {loadError && (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-md p-4">
            <div className="flex flex-col items-center text-center">
              <div className="text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="text-red-600">{loadError}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blood text-white rounded-md hover:bg-blood-hover"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMap;
