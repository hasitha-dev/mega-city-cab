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

interface Booking {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  status: "Completed" | "Scheduled" | "In Progress";
}

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Simulate fetching bookings from an API
    const fetchBookings = async () => {
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
      const data = await response.json();
      setBookings(data);
    };

    fetchBookings();
  }, []);

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
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
              <div className="text-3xl font-bold">7</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 upcoming today
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
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Pickup
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Destination
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 relative"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4">{booking.pickup}</td>
                      <td className="px-6 py-4">{booking.destination}</td>
                      <td className="px-6 py-4">{booking.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Scheduled"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-1 hover:bg-gray-100 rounded-full"
                                  onClick={() =>
                                    setActiveRow(
                                      activeRow === booking.id
                                        ? null
                                        : booking.id
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

                          {activeRow === booking.id && (
                            <div className="absolute right-16 top-3 bg-white shadow-lg rounded-md border z-10 py-1 px-2">
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
                                  onClick={() => handleView(booking)}
                                >
                                  <Eye className="h-3 w-3 text-gray-500" />
                                  <span className="text-xs">View</span>
                                </button>

                                {booking.status !== "Completed" && (
                                  <>
                                    <button
                                      className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full rounded text-left"
                                      onClick={() => handleEdit(booking)}
                                    >
                                      <Pencil className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs">Edit</span>
                                    </button>
                                    <button
                                      className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full rounded text-left"
                                      onClick={() => handleDelete(booking)}
                                    >
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                      <span className="text-xs">Cancel</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
