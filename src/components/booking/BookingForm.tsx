
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Car } from 'lucide-react';
import { toast } from 'sonner';
import LocationInput from '@/components/map/LocationInput';
import VehicleSelection from '@/components/VehicleSelection';
import { Button } from '@/components/ui/button';

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
  resetForm
}) => {
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
    
    // Here you would typically send the booking data to your backend
    toast.success("Booking submitted successfully!");
    
    // Mock data for demonstration purposes
    console.log({
      pickupLocation,
      destination,
      pickupDate,
      pickupTime,
      vehicleType,
      passengers,
      startPoint,
      endPoint,
      distance
    });
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
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>Enter the details for your vehicle reservation</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pickup Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationInput
                value={pickupLocation}
                onChange={setPickupLocation}
                onLocationSelect={handlePickupLocationSelect}
                placeholder="Enter pickup address"
                label="Pickup Location"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    className="w-full pl-10 py-2 px-3 border bg-secondary/50 rounded-md"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="time"
                    className="w-full pl-10 py-2 px-3 border bg-secondary/50 rounded-md"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Destination Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationInput
                value={destination}
                onChange={setDestination}
                onLocationSelect={handleDestinationSelect}
                placeholder="Enter destination address"
                label="Destination"
              />
            </div>
          </div>
          
          <VehicleSelection
            selectedVehicle={vehicleType}
            onVehicleSelect={setVehicleType}
          />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Passenger Information</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Passengers</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Number of passengers"
                className="w-full py-2 px-3 border bg-secondary/50 rounded-md"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Book Vehicle
            </button>
            {resetForm && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={resetForm}
              >
                Reset Form
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
