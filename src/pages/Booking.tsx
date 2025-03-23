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
  Save,
  Check,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { calculateFare } from "@/utils/mapUtils";
import { fetchBookingById, Booking as BookingType } from "@/services/api";
import InvoiceDetails from "@/components/booking/InvoiceDetails";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Booking = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const bookingFormState = useBookingForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const editBookingId = queryParams.get("edit");

  useEffect(() => {
    const loadBookingData = async () => {
      if (!editBookingId) return;

      try {
        setIsLoadingBooking(true);
        const bookingData = await fetchBookingById(editBookingId);

        if (bookingData) {
          bookingFormState.setPickupLocation(bookingData.pickupAddress);
          bookingFormState.setDestination(bookingData.destinationAddress);

          const bookingDateTime = new Date(bookingData.bookingTime);
          const dateString = bookingDateTime.toISOString().split("T")[0];
          const timeString = bookingDateTime.toTimeString().substring(0, 5);

          bookingFormState.setPickupDate(dateString);
          bookingFormState.setPickupTime(timeString);

          if (bookingData.pickupLat && bookingData.pickupLng) {
            bookingFormState.setStartPoint([
              bookingData.pickupLat,
              bookingData.pickupLng,
            ]);
          }

          if (bookingData.destinationLat && bookingData.destinationLng) {
            bookingFormState.setEndPoint([
              bookingData.destinationLat,
              bookingData.destinationLng,
            ]);
          }

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
      setIsSaving(true);
      const user = JSON.parse(
        localStorage.getItem("user") || '{"email":"user@example.com"}'
      );
      const customerEmail = user?.email || "";

      const formattedDate = new Date(bookingFormState.pickupDate).getTime();

      const method = editBookingId ? "PUT" : "POST";
      const url = editBookingId
        ? `http://localhost:8070/api/booking/${editBookingId}`
        : "http://localhost:8070/api/booking";

      const bookingData = {
        customerEmail: customerEmail,
        startLocation: bookingFormState.pickupLocation,
        destination: bookingFormState.destination,
        date: formattedDate,
        startTime: bookingFormState.pickupTime,
        passengerCount: bookingFormState.passengers,
        distance: bookingFormState.distance?.toFixed(3),
        vehicleType: bookingFormState.vehicleType,
        fare: calculateFare(
          bookingFormState.distance || 0,
          bookingFormState.vehicleType || "Sedan"
        ).toFixed(2),
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        toast.success(
          `Booking ${editBookingId ? "updated" : "created"} successfully!`
        );
        navigate("/dashboard");
      } else {
        toast.error("Failed to save booking");
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Could not connect to server");
    } finally {
      setIsSaving(false);
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

  const openInvoiceDetails = () => {
    setIsInvoiceOpen(true);
  };

  const getFare = () => {
    return calculateFare(
      bookingFormState.distance || 0,
      bookingFormState.vehicleType || "Sedan"
    );
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

            <Card className="overflow-hidden border border-primary/10 shadow-md">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Booking Confirmation</h2>
                  <Badge
                    variant="outline"
                    className="absolute right-6 top-6 bg-green-100 text-green-800 border-green-200 px-3 py-1"
                  >
                    <span className="h-2 w-2 bg-green-600 rounded-full mr-2 inline-block"></span>
                    Confirmed
                  </Badge>
                </div>

                <div className="mt-10 flex flex-wrap gap-4 items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Booking Reference
                    </p>
                    <p className="font-medium text-lg">
                      {Math.random()
                        .toString(36)
                        .substring(2, 10)
                        .toUpperCase()}
                    </p>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:shadow-lg"
                    onClick={handleSaveBooking}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Booking
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
                        <MapPin className="h-5 w-5" />
                        Trip Details
                      </h3>

                      <div className="space-y-6">
                        <div className="flex items-start gap-3 bg-muted/10 p-3 rounded-md">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-600 font-bold text-sm">
                              A
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-primary/80">
                              Pickup Location
                            </p>
                            <p className="text-sm mt-1 break-words">
                              {bookingFormState.pickupLocation}
                            </p>
                          </div>
                        </div>

                        <div className="w-0.5 bg-gray-200 h-6 mx-auto"></div>

                        <div className="flex items-start gap-3 bg-muted/10 p-3 rounded-md">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-600 font-bold text-sm">
                              B
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-primary/80">
                              Destination
                            </p>
                            <p className="text-sm mt-1 break-words">
                              {bookingFormState.destination}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-dashed space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        Booking Details
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {bookingFormState.pickupDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-medium">
                            {bookingFormState.pickupTime}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Vehicle
                          </p>
                          <p className="font-medium capitalize">
                            {bookingFormState.vehicleType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Passengers
                          </p>
                          <p className="font-medium">
                            {bookingFormState.passengers}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
                        <DollarSign className="h-5 w-5" />
                        Payment Details
                      </h3>

                      <div className="space-y-3 pb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Distance
                          </span>
                          <span>
                            {bookingFormState.distance?.toFixed(2)} km
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Base fare
                          </span>
                          <span>
                            LKR{" "}
                            {
                              {
                                sedan: "200",
                                suv: "300",
                                van: "400",
                                luxury: "600",
                              }[bookingFormState.vehicleType || "Sedan"]
                            }
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Rate per km
                          </span>
                          <span>
                            LKR{" "}
                            {
                              {
                                sedan: "50",
                                suv: "65",
                                van: "80",
                                luxury: "100",
                              }[bookingFormState.vehicleType || "Sedan"]
                            }
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total Fare</span>
                          <span className="text-primary">
                            LKR {getFare().toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-dashed space-y-3">
                        <h4 className="font-medium">Payment Methods</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="px-3 py-1">
                            Cash
                          </Badge>
                          <Badge variant="outline" className="px-3 py-1">
                            Card on arrival
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Payment will be collected upon completion of your
                          journey
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md mt-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-1.5 rounded-full">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">
                              Booking will expire in 30 minutes
                            </p>
                            <p className="text-xs mt-1">
                              Please confirm your booking by clicking the Save
                              button
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-muted/20">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary hover:bg-primary/10 flex items-center gap-1.5 border-primary/20 shadow-sm"
                      onClick={openInvoiceDetails}
                    >
                      <FileText className="h-4 w-4" />
                      View Full Details & Download
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 hover:bg-primary/5"
                        onClick={() => setBookingCompleted(false)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleSaveBooking}
                        disabled={isSaving}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                    </div>
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

      <InvoiceDetails
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        bookingDetails={{
          pickupLocation: bookingFormState.pickupLocation,
          destination: bookingFormState.destination,
          pickupDate: bookingFormState.pickupDate,
          pickupTime: bookingFormState.pickupTime,
          vehicleType: bookingFormState.vehicleType,
          passengers: bookingFormState.passengers,
          distance: bookingFormState.distance,
        }}
      />
    </div>
  );
};

export default Booking;
