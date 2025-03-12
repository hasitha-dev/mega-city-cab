
import React from 'react';
import L from 'leaflet';

interface MapMarkerProps {
  position: [number, number];
  type: 'pickup' | 'destination';
  popup?: string;
  map: L.Map;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  position,
  type,
  popup,
  map
}) => {
  React.useEffect(() => {
    // Create icon based on marker type
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${type === 'pickup' ? '#3B82F6' : '#10B981'};width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    // Create and add marker
    const marker = L.marker(position, { icon }).addTo(map);
    
    // Add popup if provided
    if (popup) {
      marker.bindPopup(popup).openPopup();
    }

    // Cleanup function
    return () => {
      map.removeLayer(marker);
    };
  }, [position, type, popup, map]);

  return null;
};

export default MapMarker;
