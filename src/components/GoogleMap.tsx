
import React, { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
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
    setInfoWindow(new google.maps.InfoWindow());

    return () => {
      setMap(null);
      setInfoWindow(null);
    };
  }, [mapRef]);

  useEffect(() => {
    if (!map || !infoWindow) return;

    // Clear existing markers
    map.setCenter(center);
    
    // Add markers
    markers.forEach((markerInfo) => {
      const marker = new google.maps.Marker({
        position: markerInfo.position,
        map,
        title: markerInfo.title,
        animation: google.maps.Animation.DROP,
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
    });
  }, [map, markers, center, infoWindow, onMarkerClick]);

  return <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-md" />;
};

export default GoogleMap;
