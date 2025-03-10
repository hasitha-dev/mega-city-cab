
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, Car } from 'lucide-react';

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Enter the details for your vehicle reservation</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
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
                            className="w-full pl-10 py-2 px-3 border rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pickup Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            type="date"
                            className="w-full pl-10 py-2 px-3 border rounded-md"
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
                            className="w-full pl-10 py-2 px-3 border rounded-md"
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
                            className="w-full pl-10 py-2 px-3 border rounded-md"
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
                          <select className="w-full pl-10 py-2 px-3 border rounded-md">
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
                          className="w-full py-2 px-3 border rounded-md"
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
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Fill out the form to see your booking summary
                  </p>
                  
                  <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Map preview will appear here
                      </p>
                    </div>
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
