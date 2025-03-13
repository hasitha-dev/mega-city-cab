
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Truck, Bus, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VehicleOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  imageUrl: string;
  capacity: number;
  description: string;
}

interface VehicleSelectionProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
  passengerCount: number;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  selectedVehicle,
  onVehicleSelect,
  passengerCount
}) => {
  const vehicleOptions: VehicleOption[] = [
    {
      id: 'sedan',
      name: 'Sedan',
      icon: <Car className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 4,
      description: 'Comfortable ride for up to 4 passengers'
    },
    {
      id: 'suv',
      name: 'SUV',
      icon: <Truck className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 6,
      description: 'Spacious vehicle with room for luggage'
    },
    {
      id: 'van',
      name: 'Van',
      icon: <Bus className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 10,
      description: 'Perfect for group travel and events'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: <Briefcase className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 3,
      description: 'Premium experience with upscale amenities'
    }
  ];

  const handleSelectVehicle = (vehicleId: string, capacity: number) => {
    if (passengerCount > capacity) {
      toast.error(`This vehicle can only accommodate ${capacity} passengers. Please select a larger vehicle or reduce passenger count.`);
      return;
    }
    onVehicleSelect(vehicleId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Vehicle Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicleOptions.map((vehicle) => {
          const isCapacityValid = passengerCount <= vehicle.capacity;
          
          return (
            <Card 
              key={vehicle.id}
              className={cn(
                "cursor-pointer hover:border-primary/50 transition-all border-2 overflow-hidden",
                selectedVehicle === vehicle.id ? "border-primary bg-primary/5" : "border-transparent",
                !isCapacityValid ? "opacity-60" : ""
              )}
              onClick={() => handleSelectVehicle(vehicle.id, vehicle.capacity)}
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img 
                  src={vehicle.imageUrl} 
                  alt={vehicle.name} 
                  className="object-cover w-full h-full"
                />
                {!isCapacityValid && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Not enough capacity</p>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-full",
                    selectedVehicle === vehicle.id ? "bg-primary/20" : "bg-secondary"
                  )}>
                    {vehicle.icon}
                  </div>
                  {vehicle.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{vehicle.description}</p>
                <div className="flex items-center mt-2">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    isCapacityValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {vehicle.capacity} passengers max
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelection;
