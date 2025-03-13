
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, Clock, Car, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';
import LocationInput from '@/components/map/LocationInput';
import VehicleSelection from '@/components/VehicleSelection';
import { Button } from '@/components/ui/button';
import { calculateFare } from '@/utils/mapUtils';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface BookingFormProps {
  pickupLocation: string;
  setPickupLocation: (location: string) => void;
  destination: string;
  setDestination: (location: string) => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  vehicleType: string;
  setVehicleType: (type: string) => void;
  passengers: number;
  setPassengers: (passengers: number) => void;
  startPoint: [number, number] | null;
  endPoint: [number, number] | null;
  distance: number | null;
  handleLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
  resetForm?: () => void;
  onSubmit: (data: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  pickupLocation,
  setPickupLocation,
  destination,
  setDestination,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  vehicleType,
  setVehicleType,
  passengers,
  setPassengers,
  startPoint,
  endPoint,
  distance,
  handleLocationSelect,
  resetForm,
  onSubmit
}) => {
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);

  useEffect(() => {
    if (distance && vehicleType) {
      const fare = calculateFare(distance, vehicleType);
      setEstimatedFare(fare);
    } else {
      setEstimatedFare(null);
    }
  }, [distance, vehicleType]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Simple validation
    if (!pickupLocation || !destination || !pickupDate || !pickupTime || !vehicleType) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!startPoint || !endPoint) {
      toast.error("Please select both pickup and destination points on the map");
      return;
    }

    if (passengers <= 0) {
      toast.error("Please select at least 1 passenger");
      return;
    }
    
    // Here you would typically send the booking data to your backend
    const bookingData = {
      pickupLocation,
      destination,
      pickupDate,
      pickupTime,
      vehicleType,
      passengers,
      startPoint,
      endPoint,
      distance,
      estimatedFare
    };
    
    onSubmit(bookingData);
  };

  const handlePickupLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    handleLocationSelect({
      ...location,
      name: location.name
    });
  };

  const handleDestinationSelect = (location: { lat: number; lng: number; name: string }) => {
    handleLocationSelect({
      ...location,
      name: location.name
    });
  };

  return (
    <Card className="bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Book Your Ride</CardTitle>
        <CardDescription>Enter the details for your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit} id="booking-form">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </span>
              Trip Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <LocationInput
                value={pickupLocation}
                onChange={setPickupLocation}
                onLocationSelect={handlePickupLocationSelect}
                placeholder="Enter pickup address"
                label="Pickup Location"
              />
              
              <LocationInput
                value={destination}
                onChange={setDestination}
                onLocationSelect={handleDestinationSelect}
                placeholder="Enter destination address"
                label="Destination"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    className="w-full pl-10 py-2 px-3 border rounded-md bg-background"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    className="w-full pl-10 py-2 px-3 border rounded-md bg-background"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </span>
              Passenger Information
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Passengers</label>
              <Input
                type="number"
                min="1"
                max="10"
                placeholder="Number of passengers"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <Separator />
          
          <VehicleSelection
            selectedVehicle={vehicleType}
            onVehicleSelect={setVehicleType}
            passengerCount={passengers}
          />
          
          {distance && estimatedFare && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span className="p-1.5 rounded-full bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </span>
                  Fare Estimate
                </h3>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Distance:</span>
                    <span className="font-medium">{distance.toFixed(2)} km</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base fare:</span>
                    <span className="font-medium">LKR {
                      {
                        'sedan': '200',
                        'suv': '300', 
                        'van': '400',
                        'luxury': '600'
                      }[vehicleType] || '200'
                    }</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Estimated Total:</span>
                    <span className="font-bold text-primary">LKR {estimatedFare.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    *Fare estimate may vary based on actual route, traffic conditions, and waiting time.
                  </p>
                </div>
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4 border-t p-6">
        {resetForm && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
          >
            Reset
          </Button>
        )}
        <Button 
          type="submit"
          form="booking-form"
          disabled={!pickupLocation || !destination || !pickupDate || !pickupTime || !vehicleType || !distance}
          className="px-8"
        >
          Book Ride
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
