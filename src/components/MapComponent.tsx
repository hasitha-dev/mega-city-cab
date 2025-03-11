
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { MapPin, Navigation2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [6.9271, 79.8612], // Colombo's center coordinates
  zoom = 12, // Higher zoom level to focus on Colombo
  markers = [],
  className = 'h-[400px]',
  onSelectLocation,
  selectionMode = false,
  onRouteSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [startMarker, setStartMarker] = useState<L.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<L.Marker | null>(null);
  const [routeLine, setRouteLine] = useState<L.Polyline | null>(null);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');

  // Set bounds for Colombo area (Western Province)
  const colomboBounds = L.latLngBounds(
    [6.7, 79.8], // Southwest corner
    [7.0, 80.0]  // Northeast corner
  );

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
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
      if (selectionMode && onRouteSelect) {
        map.on('click', async (e) => {
          // Check if click is within bounds
          if (!colomboBounds.contains(e.latlng)) {
            toast.error("Please select a location within Colombo area");
            return;
          }

          const { lat, lng } = e.latlng;
          
          try {
            // Get address from coordinates using OpenStreetMap Nominatim API
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            
            // Verify location is in Western Province/Colombo area
            const isInColombo = 
              (data.address?.city === 'Colombo') || 
              (data.address?.county === 'Colombo') || 
              (data.address?.state === 'Western Province');
            
            if (!isInColombo) {
              toast.error("Please select a location within Colombo area");
              return;
            }
            
            const locationName = data.display_name || 'Selected Location';
            
            if (selectionStep === 'start') {
              // Remove previous start marker if exists
              if (startMarker) {
                map.removeLayer(startMarker);
              }
              
              // Create new start marker
              const newStartMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="background-color:#3B82F6;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6]
                })
              }).addTo(map).bindPopup('Pickup Point: ' + locationName).openPopup();
              
              setStartMarker(newStartMarker);
              setSelectionStep('end');
              toast.success("Pickup location selected. Now select your destination.");
              
              if (onSelectLocation) {
                onSelectLocation({ lat, lng, name: locationName });
              }
            } else {
              // Remove previous end marker if exists
              if (endMarker) {
                map.removeLayer(endMarker);
              }
              
              // Create new end marker
              const newEndMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div style="background-color:#10B981;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6]
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
                  { color: '#3B82F6', weight: 3, opacity: 0.8, dashArray: '5, 10' }
                ).addTo(map);
                
                setRouteLine(newRouteLine);
                
                // Fit map to show both markers
                const bounds = L.latLngBounds([startPoint, [lat, lng]]);
                map.fitBounds(bounds, { padding: [50, 50] });
                
                // Call onRouteSelect callback with start and end points
                onRouteSelect([startPoint.lat, startPoint.lng], endPoint);
                toast.success("Route selected successfully!");
              }
              
              setSelectionStep('start'); // Reset for next selection
              
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
  }, [selectionMode]); // Re-initialize map if selection mode changes

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
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-md shadow-md text-xs z-[1000] text-gray-800 flex items-center space-x-2">
          {selectionStep === 'start' ? (
            <>
              <MapPin className="h-4 w-4 text-blue-500" />
              <p>Click on the map to set your pickup point</p>
            </>
          ) : (
            <>
              <Navigation2 className="h-4 w-4 text-green-500" />
              <p>Click on the map to set your destination</p>
            </>
          )}
        </div>
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
