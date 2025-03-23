
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
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [activeRow, setActiveRow] = useState<string | null>(null);
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

  const handleEdit = (booking: Booking) => {
    toast.info(`Editing booking ${booking.id}`);
    setActiveRow(null);
  };

  const handleDelete = (booking: Booking) => {
    if (booking.status === "Completed") {
      toast.error("Cannot delete completed bookings");
      return;
    }

    toast.success(`Booking ${booking.id} deleted`);
    setBookings(bookings.filter((b) => b.id !== booking.id));
    setActiveRow(null);
  };

  const handleView = (booking: Booking) => {
    toast.info(`Viewing details for booking ${booking.id}`);
    setActiveRow(null);
  };

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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
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
                        <TableCell>
                          <div className="flex items-center space-x-2 relative">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                    onClick={() =>
                                      setActiveRow(
                                        activeRow === booking.tripId
                                          ? null
                                          : booking.tripId
                                      )
                                    }
                                  >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Booking actions</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {activeRow === booking.tripId && (
                              <div className="absolute right-0 top-0 bg-white shadow-lg rounded-md border z-10 py-1 px-2">
                                <div className="flex items-center justify-between pb-1">
                                  <p className="text-xs font-semibold">Actions</p>
                                  <button
                                    onClick={() => setActiveRow(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="space-y-1 pt-1 border-t">
                                  <button
                                    className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full rounded text-left"
                                    onClick={() => handleView({
                                      id: booking.tripId,
                                      pickup: booking.startLocation,
                                      destination: booking.destination,
                                      date: new Date(booking.date).toLocaleDateString() + ' ' + booking.startTime,
                                      status: "Scheduled"
                                    })}
                                  >
                                    <Eye className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs">View</span>
                                  </button>
                                  <button
                                    className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full rounded text-left"
                                    onClick={() => handleEdit({
                                      id: booking.tripId,
                                      pickup: booking.startLocation,
                                      destination: booking.destination,
                                      date: new Date(booking.date).toLocaleDateString() + ' ' + booking.startTime,
                                      status: "Scheduled"
                                    })}
                                  >
                                    <Pencil className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs">Edit</span>
                                  </button>
                                  <button
                                    className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full rounded text-left"
                                    onClick={() => handleDelete({
                                      id: booking.tripId,
                                      pickup: booking.startLocation,
                                      destination: booking.destination,
                                      date: new Date(booking.date).toLocaleDateString() + ' ' + booking.startTime,
                                      status: "Scheduled"
                                    })}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                    <span className="text-xs">Cancel</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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
