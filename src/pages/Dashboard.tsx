
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  MapPin,
  CalendarCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApiBooking {
  tripId: string;
  vehicleType: string;
  customerEmail: string;
  date: number;
  destination: string;
  startLocation: string;
  startTime: string;
  fare: string;
  distance: string;
  passengerCount: number;
}

interface Booking {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  status: "Completed" | "Scheduled" | "In Progress";
}

interface ApiResponse {
  success: string;
  description: string;
  message: string;
  data: string; // JSON string that needs to be parsed
}

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [apiBookings, setApiBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch bookings from API
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8070/api/booking?userEmail=${encodeURIComponent(
            user.email
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        
        const responseData: ApiResponse = await response.json();
        
        if (responseData.success) {
          // Parse the data string into an array of bookings
          const parsedBookings: ApiBooking[] = JSON.parse(responseData.data);
          setApiBookings(parsedBookings);
          
          // Convert API bookings to our Booking format
          const formattedBookings: Booking[] = parsedBookings.map(booking => ({
            id: booking.tripId,
            pickup: booking.startLocation,
            destination: booking.destination,
            date: new Date(booking.date).toLocaleDateString() + ' ' + booking.startTime,
            status: "Scheduled" // Default status
          }));
          
          setBookings(formattedBookings);
          toast.success("Bookings loaded successfully");
        } else {
          toast.error("Failed to load bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Error loading bookings");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchBookings();
    }
  }, [user?.email]);

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your vehicle reservation management
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Bookings
              </CardTitle>
              <CalendarCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Your current bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Available Cars
              </CardTitle>
              <Car className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of 15 total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                On-duty Drivers
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 currently on trips
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent bookings section */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Recent Bookings</h2>
        <Card>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No bookings found. Book your first ride now!
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiBookings.map((booking) => (
                      <TableRow key={booking.tripId}>
                        <TableCell className="font-medium">
                          {booking.tripId.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{booking.startLocation}</TableCell>
                        <TableCell>{booking.destination}</TableCell>
                        <TableCell>
                          {format(new Date(booking.date), 'MMM dd, yyyy')} at {booking.startTime}
                        </TableCell>
                        <TableCell>${booking.fare}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Scheduled
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
