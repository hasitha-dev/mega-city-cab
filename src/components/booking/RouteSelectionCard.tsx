
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapComponent from '@/components/MapComponent';
import { MapPin, Navigation, Route } from 'lucide-react';

interface RouteSelectionCardProps {
  mapCenter: [number, number];
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
  passengers: number;
  distance: number | null;
  selectionStep: 'pickup' | 'destination';
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
  selectionStep,
  handleLocationSelect,
  handleRouteSelect
}) => {
  return (
    <Card className="bg-card overflow-hidden border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Route Selection
        </CardTitle>
        <CardDescription>Select pickup and destination in Colombo area</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[400px]">
            <MapComponent 
              center={[6.9271, 79.8612]} // Colombo center
              zoom={12}
              className="h-full w-full"
              selectionMode={true}
              onSelectLocation={handleLocationSelect}
              onRouteSelect={handleRouteSelect}
              selectionStep={selectionStep}
            />
          </div>
          
          {distance && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
              <p className="text-sm font-medium">Estimated Distance:</p>
              <p className="text-lg font-bold">{distance.toFixed(2)} km</p>
            </div>
          )}
          
          <div className="space-y-3 mt-2">
            {pickupLocation && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <span className="text-sm font-medium block">From:</span>
                  <p className="text-sm text-gray-600">{pickupLocation}</p>
                </div>
              </div>
            )}
            {destination && (
              <div className="flex items-start space-x-2">
                <Navigation className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <span className="text-sm font-medium block">To:</span>
                  <p className="text-sm text-gray-600">{destination}</p>
                </div>
              </div>
            )}
            {pickupDate && pickupTime && (
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4"></div> {/* Spacer for alignment */}
                <div>
                  <span className="text-sm font-medium block">When:</span>
                  <p className="text-sm text-gray-600">{pickupDate} at {pickupTime}</p>
                </div>
              </div>
            )}
            {vehicleType && (
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4"></div> {/* Spacer for alignment */}
                <div>
                  <span className="text-sm font-medium block">Vehicle:</span>
                  <p className="text-sm text-gray-600">{vehicleType} ({passengers} passenger{passengers !== 1 ? 's' : ''})</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteSelectionCard;
