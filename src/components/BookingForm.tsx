
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { createBooking } from '@/services/api';
import MapPicker from './MapPicker';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

const BookingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');

  // Mock map display
  const MapDisplay = () => (
    <div className="w-full h-64 bg-secondary rounded-lg overflow-hidden relative animate-pulse-slow">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {pickup && destination 
              ? 'Your route is ready' 
              : 'Select pickup and destination locations'}
          </p>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickup || !destination || !date || !time || !user) {
      return;
    }

    try {
      setLoading(true);

      // Combine date and time for booking
      const [hours, minutes] = time.split(':');
      const bookingTime = new Date(date);
      bookingTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      await createBooking({
        userId: user.id,
        pickupAddress: pickup.address,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        destinationAddress: destination.address,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        bookingTime: bookingTime.toISOString(),
      });

      // Navigate to booking list after successful creation
      navigate('/booking');
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full transition-all duration-300 animate-slide-up">
      <CardHeader>
        <CardTitle>Book a Ride</CardTitle>
        <CardDescription>Enter your journey details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-primary" />
                Pickup Location
              </label>
              <MapPicker 
                onSelectLocation={(loc) => setPickup(loc)} 
                placeholder="Enter pickup address" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-primary" />
                Destination
              </label>
              <MapPicker 
                onSelectLocation={(loc) => setDestination(loc)} 
                placeholder="Enter destination address" 
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  Time
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="mt-4">
            <MapDisplay />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!pickup || !destination || !date || !time || loading}
          className="group"
        >
          {loading ? 'Processing...' : 'Book Now'}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
