
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CircleDashed, 
  Clock, 
  MapPin, 
  Plus,
  FileText, 
  CheckCircle2,
  X,
  Car
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchBookings, updateBookingStatus, Booking } from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const BookingList = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchBookings(isAdmin ? undefined : user?.id);
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bookings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.id, isAdmin, toast]);

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Update the local state to reflect the change
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Confirmed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full transition-all duration-300 animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>View and manage your ride bookings</CardDescription>
        </div>
        <Button onClick={() => navigate('/booking/new')} className="group">
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <CircleDashed className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't made any bookings yet. Create your first one!
            </p>
            <Button onClick={() => navigate('/booking/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded-lg p-4 hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">From:</p>
                        <p className="text-sm text-muted-foreground">{booking.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">To:</p>
                        <p className="text-sm text-muted-foreground">{booking.destinationAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        {format(new Date(booking.bookingTime), 'PPP')} at {format(new Date(booking.bookingTime), 'p')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      {booking.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/billing/${booking.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Bill
                        </Button>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Update Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'in-progress')}>
                            <Car className="h-4 w-4 mr-2 text-purple-500" />
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                            <X className="h-4 w-4 mr-2 text-red-500" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingList;
