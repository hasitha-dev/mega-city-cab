
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/booking/BookingForm';
import RouteSelectionCard from '@/components/booking/RouteSelectionCard';
import useBookingForm from '@/hooks/useBookingForm';
import EditPopup from '@/components/booking/EditPopup';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, Edit2, Trash2, MapPin, Calendar, UserCircle, Car } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { calculateFare } from '@/utils/mapUtils';

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const bookingFormState = useBookingForm();
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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

  const handleConfirmDelete = () => {
    toast.success("Booking deleted successfully!");
    setBookingCompleted(false);
    setCurrentBooking(null);
    bookingFormState.resetForm();
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteBooking = () => {
    setIsDeleteDialogOpen(true);
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
            
            <Card className="overflow-hidden border bg-card">
              <div className="bg-primary/10 p-6 border-b">
                <div className="flex justify-between items-center">
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
                
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  Booking Confirmed
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        Trip Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">A</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Pickup Location</p>
                            <p className="font-medium">{bookingFormState.pickupLocation}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">B</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Destination</p>
                            <p className="font-medium">{bookingFormState.destination}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pickup Time</p>
                            <p className="font-medium">{bookingFormState.pickupDate} at {bookingFormState.pickupTime}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <UserCircle className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Passengers</p>
                            <p className="font-medium">{bookingFormState.passengers} passenger{bookingFormState.passengers !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {bookingFormState.distance && bookingFormState.vehicleType && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <Car className="h-5 w-5 text-primary" />
                          Fare Details
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Distance</span>
                            <span>{bookingFormState.distance.toFixed(2)} km</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vehicle Type</span>
                            <span className="capitalize">{bookingFormState.vehicleType}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Fare</span>
                            <span>LKR {
                              {
                                'sedan': '200',
                                'suv': '300', 
                                'van': '400',
                                'luxury': '600'
                              }[bookingFormState.vehicleType] || '200'
                            }</span>
                          </div>
                          
                          <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                            <span>Total Fare</span>
                            <span className="text-primary">
                              LKR {calculateFare(bookingFormState.distance, bookingFormState.vehicleType).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="h-[400px] rounded-lg overflow-hidden border">
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
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="max-w-2xl mx-auto lg:col-span-1">
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
                onSubmit={handleBookingSubmit}
              />
            </div>
            
            <div className="lg:col-span-1">
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
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default Booking;
