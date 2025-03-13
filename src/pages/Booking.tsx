
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/booking/BookingForm";
import useBookingForm from "@/hooks/useBookingForm";
import EditPopup from "@/components/booking/EditPopup";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircle,
  Edit2,
  Calendar,
  MapPin,
  UserCircle,
  Car,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { calculateFare } from "@/utils/mapUtils";
import { fetchBookingById, Booking as BookingType } from "@/services/api";

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const bookingFormState = useBookingForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);

  // Extract any query parameters
  const queryParams = new URLSearchParams(location.search);
  const editBookingId = queryParams.get('edit');

  // Fetch booking data if we're in edit mode
  useEffect(() => {
    const loadBookingData = async () => {
      if (!editBookingId) return;

      try {
        setIsLoadingBooking(true);
        const bookingData = await fetchBookingById(editBookingId);
        
        if (bookingData) {
          // Set form values from booking data
          bookingFormState.setPickupLocation(bookingData.pickupAddress);
          bookingFormState.setDestination(bookingData.destinationAddress);
          
          // Convert ISO date to local date format
          const bookingDateTime = new Date(bookingData.bookingTime);
          const dateString = bookingDateTime.toISOString().split('T')[0];
          const timeString = bookingDateTime.toTimeString().substring(0, 5);
          
          bookingFormState.setPickupDate(dateString);
          bookingFormState.setPickupTime(timeString);
          
          // Set map points if available
          if (bookingData.pickupLat && bookingData.pickupLng) {
            bookingFormState.setStartPoint([bookingData.pickupLat, bookingData.pickupLng]);
          }
          
          if (bookingData.destinationLat && bookingData.destinationLng) {
            bookingFormState.setEndPoint([bookingData.destinationLat, bookingData.destinationLng]);
          }
          
          // Calculate distance
          if (bookingFormState.startPoint && bookingFormState.endPoint) {
            bookingFormState.handleRouteSelect(
              bookingFormState.startPoint, 
              bookingFormState.endPoint
            );
          }
          
          toast.success("Booking loaded for editing");
        } else {
          toast.error("Booking not found");
        }
      } catch (error) {
        console.error("Error loading booking:", error);
        toast.error("Failed to load booking data");
      } finally {
        setIsLoadingBooking(false);
      }
    };

    if (editBookingId && isAuthenticated) {
      loadBookingData();
    }
  }, [editBookingId, isAuthenticated]);

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading || isLoadingBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleBookingSubmit = async (bookingData: any) => {
    setCurrentBooking(bookingData);
    setBookingCompleted(true);
    toast.success("Booking created successfully!");
  };

  const handleSaveBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || '{"email":"user@example.com"}');
      const customerEmail = user?.email || "";
      
      // Determine if we're updating or creating
      const method = editBookingId ? "PUT" : "POST";
      const url = editBookingId 
        ? `http://localhost:8070/api/booking/${editBookingId}` 
        : "http://localhost:8070/api/booking";
      
      const bookingData = {
        customerEmail: customerEmail,
        startLocation: bookingFormState.pickupLocation,
        destination: bookingFormState.destination,
        date: bookingFormState.pickupDate,
        startTime: bookingFormState.pickupTime,
        passengerCount: bookingFormState.passengers,
        distance: bookingFormState.distance,
        vehicleType: bookingFormState.vehicleType,
        fare: calculateFare(
          bookingFormState.distance || 0,
          bookingFormState.vehicleType || 'sedan'
        ),
      };
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      
      if (response.ok) {
        toast.success(`Booking ${editBookingId ? 'updated' : 'created'} successfully!`);
        navigate("/dashboard");
      } else {
        toast.error("Failed to save booking");
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Could not connect to server");
    }
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
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            {editBookingId ? "Edit Booking" : "Book a Vehicle"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {editBookingId 
              ? "Update your booking details below" 
              : "Create a new booking by filling out the form below"}
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
              Back to Home
            </Button>

            <Card className="overflow-hidden border bg-card">
              <div className="bg-primary/10 p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Booking Confirmation</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleSaveBooking}
                    >
                      <Edit2 className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  Booking Confirmed
                </div>
              </div>

              <CardContent className="p-6">
                <div className=" pb-6 mb-6 border-gray-200">
                  <div className="space-y-6">
                    <div className=" border-gray-200 border rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        Trip Details
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">
                              A
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Pickup Location
                            </p>
                            <p className="font-medium">
                              {bookingFormState.pickupLocation}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">
                              B
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Destination
                            </p>
                            <p className="font-medium">
                              {bookingFormState.destination}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Pickup Time
                            </p>
                            <p className="font-medium">
                              {bookingFormState.pickupDate} at{" "}
                              {bookingFormState.pickupTime}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <UserCircle className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Passengers
                            </p>
                            <p className="font-medium">
                              {bookingFormState.passengers} passenger
                              {bookingFormState.passengers !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {bookingFormState.distance &&
                      bookingFormState.vehicleType && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                            <Car className="h-5 w-5 text-primary" />
                            Fare Details
                          </h3>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Distance
                              </span>
                              <span>
                                {bookingFormState.distance.toFixed(2)} km
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Vehicle Type
                              </span>
                              <span className="capitalize">
                                {bookingFormState.vehicleType}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Base Fare
                              </span>
                              <span>
                                LKR{" "}
                                {{
                                  sedan: "200",
                                  suv: "300",
                                  van: "400",
                                  luxury: "600",
                                }[bookingFormState.vehicleType] || "200"}
                              </span>
                            </div>

                            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                              <span>Total Fare</span>
                              <span className="text-primary">
                                LKR{" "}
                                {calculateFare(
                                  bookingFormState.distance,
                                  bookingFormState.vehicleType
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="">
            <div className=" mx-auto ">
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
                mapCenter={bookingFormState.mapCenter}
                selectionStep={bookingFormState.selectionStep}
                handleRouteSelect={bookingFormState.handleRouteSelect}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
