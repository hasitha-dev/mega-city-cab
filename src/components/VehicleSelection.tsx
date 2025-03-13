
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
  basePrice: number;
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
      description: 'Comfortable ride for up to 4 passengers',
      basePrice: 200
    },
    {
      id: 'suv',
      name: 'SUV',
      icon: <Truck className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 6,
      description: 'Spacious vehicle with room for luggage',
      basePrice: 300
    },
    {
      id: 'van',
      name: 'Van',
      icon: <Bus className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 10,
      description: 'Perfect for group travel and events',
      basePrice: 400
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: <Briefcase className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      capacity: 3,
      description: 'Premium experience with upscale amenities',
      basePrice: 600
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicleOptions.map((vehicle) => {
          const isCapacityValid = passengerCount <= vehicle.capacity;
          const isSelected = selectedVehicle === vehicle.id;
          
          return (
            <Card 
              key={vehicle.id}
              className={cn(
                "cursor-pointer transition-all duration-200 overflow-hidden",
                isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md",
                !isCapacityValid ? "opacity-60" : ""
              )}
              onClick={() => handleSelectVehicle(vehicle.id, vehicle.capacity)}
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-2/5 h-40 sm:h-auto relative">
                  <img 
                    src={vehicle.imageUrl} 
                    alt={vehicle.name} 
                    className="object-cover w-full h-full"
                  />
                  {!isCapacityValid && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <p className="text-white text-sm font-medium px-2 py-1 bg-red-500 rounded">
                        Not enough capacity
                      </p>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 flex flex-col flex-grow sm:w-3/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "p-2 rounded-full",
                      isSelected ? "bg-primary/20" : "bg-secondary"
                    )}>
                      {vehicle.icon}
                    </div>
                    <h4 className="font-medium">{vehicle.name}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{vehicle.description}</p>
                  
                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className={cn(
                        "font-medium px-2 py-0.5 rounded-full text-xs",
                        isCapacityValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}>
                        {vehicle.capacity} passengers
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Base fare:</span>
                      <span className="font-medium">LKR {vehicle.basePrice}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelection;
