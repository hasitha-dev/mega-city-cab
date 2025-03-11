
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
  
  // State for map coordinates
  const [mapCenter, setMapCenter] = useState<[number, number]>([7.8731, 80.7718]); // Sri Lanka center
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

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

  // Handle route selection from map
  const handleRouteSelect = (start: [number, number], end: [number, number]) => {
    setStartPoint(start);
    setEndPoint(end);
    
    // Calculate distance in kilometers (simple straight-line distance)
    const R = 6371; // Radius of the Earth in km
    const dLat = (end[0] - start[0]) * Math.PI / 180;
    const dLon = (end[1] - start[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(start[0] * Math.PI / 180) * Math.cos(end[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    setDistance(distance);
  };

  // Handle location selection from map
  const handleLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    if (!pickupLocation) {
      setPickupLocation(location.name);
    } else if (!destination) {
      setDestination(location.name);
    }
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
