
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, Car } from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import { toast } from 'sonner';

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [passengers, setPassengers] = useState(1);
  
  // Mock coordinates for the map
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Simple validation
    if (!pickupLocation || !destination || !pickupDate || !pickupTime || !vehicleType) {
      toast.error("Please fill in all required fields");
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
      passengers
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 px-4 pb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Book a Vehicle</h1>
          <p className="text-muted-foreground mt-2">
            Create a new booking by filling out the form below
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pickup Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Enter pickup address"
                            className="w-full pl-10 py-2 px-3 border bg-secondary/50 rounded-md"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                          />
                        </div>
                      </div>
                      
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Destination</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Enter destination address"
                            className="w-full pl-10 py-2 px-3 border bg-secondary/50 rounded-md"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Vehicle Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Vehicle Type</label>
                        <div className="relative">
                          <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <select 
                            className="w-full pl-10 py-2 px-3 border bg-secondary/50 rounded-md"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                          >
                            <option value="">Select vehicle type</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="van">Van</option>
                            <option value="luxury">Luxury</option>
                          </select>
                        </div>
                      </div>
                      
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
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Book Vehicle
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(!pickupLocation && !destination) ? (
                    <p className="text-muted-foreground text-sm">
                      Fill out the form to see your booking summary
                    </p>
                  ) : (
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
                  )}
                  
                  <div className="h-[300px]">
                    <MapComponent 
                      center={mapCenter}
                      zoom={13}
                      markers={[
                        { position: mapCenter, popup: "Your location" }
                      ]}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
