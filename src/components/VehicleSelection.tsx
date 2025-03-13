
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Bus, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  capacity: string;
  description: string;
}

interface VehicleSelectionProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  selectedVehicle,
  onVehicleSelect
}) => {
  const vehicleOptions: VehicleOption[] = [
    {
      id: 'sedan',
      name: 'Sedan',
      icon: <Car className="h-6 w-6" />,
      capacity: '1-4',
      description: 'Comfortable ride for up to 4 passengers'
    },
    {
      id: 'suv',
      name: 'SUV',
      icon: <Truck className="h-6 w-6" />,
      capacity: '1-6',
      description: 'Spacious vehicle with room for luggage'
    },
    {
      id: 'van',
      name: 'Van',
      icon: <Bus className="h-6 w-6" />,
      capacity: '1-10',
      description: 'Perfect for group travel and events'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: <Car className="h-6 w-6" />,
      capacity: '1-3',
      description: 'Premium experience with upscale amenities'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Vehicle Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vehicleOptions.map((vehicle) => (
          <Card 
            key={vehicle.id}
            className={cn(
              "cursor-pointer hover:border-primary/50 transition-all border-2",
              selectedVehicle === vehicle.id ? "border-primary bg-primary/5" : "border-transparent"
            )}
            onClick={() => onVehicleSelect(vehicle.id)}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={cn(
                "p-3 rounded-full",
                selectedVehicle === vehicle.id ? "bg-primary/20" : "bg-secondary"
              )}>
                {vehicle.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{vehicle.name}</h4>
                <p className="text-xs text-muted-foreground">{vehicle.description}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                    {vehicle.capacity} passengers
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelection;
