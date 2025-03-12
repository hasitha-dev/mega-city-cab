
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/booking/BookingForm';
import RouteSelectionCard from '@/components/booking/RouteSelectionCard';
import useBookingForm from '@/hooks/useBookingForm';
import EditPopup from '@/components/booking/EditPopup';

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const bookingFormState = useBookingForm();
  
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
            />
          </div>
          
          <div>
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
