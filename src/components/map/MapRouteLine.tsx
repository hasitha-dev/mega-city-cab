
import React from 'react';
import L from 'leaflet';

interface MapRouteLineProps {
  startPoint: [number, number];
  endPoint: [number, number];
  map: L.Map;
}

const MapRouteLine: React.FC<MapRouteLineProps> = ({
  startPoint,
  endPoint,
  map
}) => {
  React.useEffect(() => {
    // Create and add route line
    const routeLine = L.polyline(
      [startPoint, endPoint],
      { color: '#3B82F6', weight: 3, opacity: 0.8, dashArray: '5, 10' }
    ).addTo(map);
    
    // Fit map to show both markers
    const bounds = L.latLngBounds([startPoint, endPoint]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Cleanup function
    return () => {
      map.removeLayer(routeLine);
    };
  }, [startPoint, endPoint, map]);

  return null;
};

export default MapRouteLine;
