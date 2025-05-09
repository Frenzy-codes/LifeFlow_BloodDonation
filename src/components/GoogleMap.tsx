
import React, { useEffect, useRef, useState } from "react";

// Add Google Maps types
declare global {
  interface Window {
    google: typeof google;
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      const loadTimer = setInterval(() => {
        if (window.google) {
          setIsLoaded(true);
          clearInterval(loadTimer);
        }
      }, 100);
      
      return () => clearInterval(loadTimer);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    try {
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
    } catch (error) {
      console.error("Error initializing Google Map:", error);
    }

    return () => {
      setMap(null);
      setInfoWindow(null);
    };
  }, [mapRef, isLoaded, center, zoom]);

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
    <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-md">
      {!isLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blood"></div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
