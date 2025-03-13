
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/booking/BookingForm';
import RouteSelectionCard from '@/components/booking/RouteSelectionCard';
import useBookingForm from '@/hooks/useBookingForm';
import EditPopup from '@/components/booking/EditPopup';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const bookingFormState = useBookingForm();
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  
  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleBookingSubmit = (bookingData: any) => {
    setCurrentBooking(bookingData);
    setBookingCompleted(true);
    toast.success("Booking created successfully!");
  };

  const handleUpdateBooking = () => {
    bookingFormState.openEditModal(currentBooking);
  };

  const handleDeleteBooking = () => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      toast.success("Booking deleted successfully!");
      setBookingCompleted(false);
      setCurrentBooking(null);
      bookingFormState.resetForm();
    }
  };

  const handleBackToForm = () => {
    setBookingCompleted(false);
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
        
        {bookingCompleted ? (
          <div className="space-y-6">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleBackToForm}
            >
              <ArrowLeftCircle className="h-4 w-4" />
              Back to Booking Form
            </Button>
            
            <div className="bg-card rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Booking Confirmation</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleUpdateBooking}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleDeleteBooking}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Trip Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground block">Pickup:</span>
                      <p className="font-medium">{bookingFormState.pickupLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Destination:</span>
                      <p className="font-medium">{bookingFormState.destination}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Date & Time:</span>
                      <p className="font-medium">{bookingFormState.pickupDate} at {bookingFormState.pickupTime}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Distance:</span>
                      <p className="font-medium">{bookingFormState.distance ? `${bookingFormState.distance.toFixed(2)} km` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Vehicle Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground block">Vehicle Type:</span>
                      <p className="font-medium capitalize">{bookingFormState.vehicleType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground block">Passengers:</span>
                      <p className="font-medium">{bookingFormState.passengers}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Booking Status</h3>
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md inline-flex items-center">
                      <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                      Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BookingForm 
                pickupLocation={bookingFormState.pickupLocation}
                setPickupLocation={bookingFormState.setPickupLocation}
                destination={bookingFormState.destination}
                setDestination={bookingFormState.setDestination}
                pickupDate={bookingFormState.pickupDate}
                setPickupDate={bookingFormState.setPickupDate}
                pickupTime={bookingFormState.pickupTime}
                setPickupTime={bookingFormState.setPickupTime}
                vehicleType={bookingFormState.vehicleType}
                setVehicleType={bookingFormState.setVehicleType}
                passengers={bookingFormState.passengers}
                setPassengers={bookingFormState.setPassengers}
                startPoint={bookingFormState.startPoint}
                endPoint={bookingFormState.endPoint}
                distance={bookingFormState.distance}
                handleLocationSelect={bookingFormState.handleLocationSelect}
                resetForm={bookingFormState.resetForm}
              />
            </div>
            
            <div className="lg:col-span-2">
              <RouteSelectionCard 
                mapCenter={bookingFormState.mapCenter}
                pickupLocation={bookingFormState.pickupLocation}
                destination={bookingFormState.destination}
                pickupDate={bookingFormState.pickupDate}
                pickupTime={bookingFormState.pickupTime}
                vehicleType={bookingFormState.vehicleType}
                passengers={bookingFormState.passengers}
                distance={bookingFormState.distance}
                selectionStep={bookingFormState.selectionStep}
                handleLocationSelect={bookingFormState.handleLocationSelect}
                handleRouteSelect={bookingFormState.handleRouteSelect}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Popup */}
      <EditPopup 
        isOpen={bookingFormState.isEditModalOpen}
        onClose={bookingFormState.closeEditModal}
        onSave={bookingFormState.handleEditItem}
        onDelete={bookingFormState.handleDeleteItem}
        item={bookingFormState.currentEditItem}
      />
    </div>
  );
};

export default Booking;
