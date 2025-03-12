
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MapSelectionHelper from './map/MapSelectionHelper';
import { colomboBounds, getAddressFromCoordinates } from '@/utils/mapUtils';

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
  className?: string;
  onSelectLocation?: (location: { lat: number; lng: number; name: string }) => void;
  selectionMode?: boolean;
  onRouteSelect?: (start: [number, number], end: [number, number]) => void;
  selectionStep?: 'pickup' | 'destination';
  showInvoiceDetails?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [6.9271, 79.8612], // Colombo's center coordinates
  zoom = 12, // Higher zoom level to focus on Colombo
  markers = [],
  className = 'h-[400px]',
  onSelectLocation,
  selectionMode = false,
  onRouteSelect,
  selectionStep = 'pickup',
  showInvoiceDetails
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [startMarker, setStartMarker] = useState<L.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<L.Marker | null>(null);
  const [routeLine, setRouteLine] = useState<L.Polyline | null>(null);
  const hasRoute = startMarker !== null && endMarker !== null;

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map with light theme
      const map = L.map(mapRef.current, {
        maxBounds: colomboBounds,
        minZoom: 11
      }).setView(center, zoom);
      
      // Add light theme tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      
      // Save map instance to ref
      mapInstanceRef.current = map;
      
      // Add markers
      markers.forEach(marker => {
        const mapMarker = L.marker(marker.position).addTo(map);
        if (marker.popup) {
          mapMarker.bindPopup(marker.popup);
        }
      });

      // Add click event for location selection
      if (selectionMode && onSelectLocation) {
        map.on('click', async (e) => {
          // Check if click is within bounds
          if (!colomboBounds.contains(e.latlng)) {
            toast.error("Please select a location within Colombo area");
            return;
          }

          const { lat, lng } = e.latlng;
          
          try {
            const locationName = await getAddressFromCoordinates(lat, lng);
            if (!locationName) return;
            
            if (selectionStep === 'pickup') {
              // Remove previous start marker if exists
              if (startMarker) {
                map.removeLayer(startMarker);
              }
              
              // Create new start marker with custom icon
              const newStartMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="background-color:#3B82F6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })
              }).addTo(map).bindPopup('Pickup Point: ' + locationName).openPopup();
              
              setStartMarker(newStartMarker);
              
              if (onSelectLocation) {
                onSelectLocation({ lat, lng, name: locationName });
              }
            } else if (selectionStep === 'destination') {
              // Remove previous end marker if exists
              if (endMarker) {
                map.removeLayer(endMarker);
              }
              
              // Create new end marker with custom icon
              const newEndMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="background-color:#10B981;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })
              }).addTo(map).bindPopup('Destination: ' + locationName).openPopup();
              
              setEndMarker(newEndMarker);
              
              // Draw a route line between markers
              if (startMarker) {
                const startPoint = startMarker.getLatLng();
                const endPoint = [lat, lng] as [number, number];
                
                // Remove previous route line if exists
                if (routeLine) {
                  map.removeLayer(routeLine);
                }
                
                // Create new route line
                const newRouteLine = L.polyline(
                  [
                    [startPoint.lat, startPoint.lng],
                    [lat, lng]
                  ],
                  { color: '#3B82F6', weight: 4, opacity: 0.9, dashArray: '8, 12' }
                ).addTo(map);
                
                setRouteLine(newRouteLine);
                
                // Fit map to show both markers
                const bounds = L.latLngBounds([startPoint, [lat, lng]]);
                map.fitBounds(bounds, { padding: [50, 50] });
                
                // Call onRouteSelect callback with start and end points
                if (onRouteSelect) {
                  onRouteSelect([startPoint.lat, startPoint.lng], endPoint);
                }
              }
              
              if (onSelectLocation) {
                onSelectLocation({ lat, lng, name: locationName });
              }
            }
          } catch (error) {
            console.error('Error fetching location info:', error);
            toast.error('Error getting location information. Please try again.');
          }
        });
      }
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectionStep]); // Re-initialize map if selection step changes

  // Update the map when center or zoom change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className="map-container relative">
      <div ref={mapRef} className={`${className} rounded-lg w-full h-full border border-gray-200`} />
      {selectionMode && (
        <MapSelectionHelper 
          selectionStep={selectionStep} 
          showInvoiceDetails={showInvoiceDetails}
          hasRoute={hasRoute}
        />
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-md shadow-md z-[1000]">
              <p className="text-xs text-gray-800">Area: <span className="font-medium">Colombo</span></p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Map is restricted to Colombo area</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MapComponent;
