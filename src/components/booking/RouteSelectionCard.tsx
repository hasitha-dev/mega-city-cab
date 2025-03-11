
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapComponent from '@/components/MapComponent';

interface RouteSelectionCardProps {
  mapCenter: [number, number];
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
  passengers: number;
  distance: number | null;
  handleLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
  handleRouteSelect: (start: [number, number], end: [number, number]) => void;
}

const RouteSelectionCard: React.FC<RouteSelectionCardProps> = ({
  mapCenter,
  pickupLocation,
  destination,
  pickupDate,
  pickupTime,
  vehicleType,
  passengers,
  distance,
  handleLocationSelect,
  handleRouteSelect
}) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Route Selection</CardTitle>
        <CardDescription>Click on the map to select pickup and destination points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[400px]">
            <MapComponent 
              center={mapCenter}
              zoom={7}
              className="h-full w-full"
              selectionMode={true}
              onSelectLocation={handleLocationSelect}
              onRouteSelect={handleRouteSelect}
            />
          </div>
          
          {distance && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-md">
              <p className="text-sm font-medium">Estimated Distance:</p>
              <p className="text-lg font-bold">{distance.toFixed(2)} km</p>
            </div>
          )}
          
          <div className="space-y-3">
            {pickupLocation && (
              <div>
                <span className="text-sm font-medium">From:</span>
                <p className="text-sm">{pickupLocation}</p>
              </div>
            )}
            {destination && (
              <div>
                <span className="text-sm font-medium">To:</span>
                <p className="text-sm">{destination}</p>
              </div>
            )}
            {pickupDate && pickupTime && (
              <div>
                <span className="text-sm font-medium">When:</span>
                <p className="text-sm">{pickupDate} at {pickupTime}</p>
              </div>
            )}
            {vehicleType && (
              <div>
                <span className="text-sm font-medium">Vehicle:</span>
                <p className="text-sm">{vehicleType} ({passengers} passenger{passengers !== 1 ? 's' : ''})</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteSelectionCard;
