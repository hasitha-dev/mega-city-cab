
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Download,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Search,
  FileDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { format } from "date-fns";
import { BookingForInvoice, generateInvoicePDF } from "@/utils/pdfUtils";

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

interface Invoice {
  id: string;
  bookingId: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  pickup: string;
  destination: string;
  vehicleType: string;
  passengerCount: number;
  distance: string;
}

interface ApiResponse {
  success: string;
  description: string;
  message: string;
  data: string; // JSON string that needs to be parsed
}

const Billing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
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
          
          // Convert API bookings to invoices format
          const newInvoices: Invoice[] = parsedBookings.map(booking => ({
            id: booking.tripId,
            bookingId: booking.tripId,
            date: format(new Date(booking.date), 'yyyy-MM-dd'),
            amount: booking.fare,
            status: "Paid", // Default status
            pickup: booking.startLocation,
            destination: booking.destination,
            vehicleType: booking.vehicleType,
            passengerCount: booking.passengerCount,
            distance: booking.distance
          }));
          
          setInvoices(newInvoices);
          toast.success("Invoices loaded successfully");
        } else {
          toast.error("Failed to load invoices");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Error loading invoices");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.email) {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

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

  const handleEdit = (invoice: Invoice) => {
    // Navigate to booking edit page with the booking ID
    navigate(`/booking?edit=${invoice.bookingId}`);
    setActiveRow(null);
  };

  const handleDeletePrompt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
    setActiveRow(null);
  };

  const handleDelete = () => {
    if (!selectedInvoice) return;

    toast.success(`Invoice ${selectedInvoice.id} deleted`);
    setInvoices(invoices.filter((inv) => inv.id !== selectedInvoice.id));
    setIsDeleteDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      const bookingForInvoice: BookingForInvoice = {
        id: invoice.id,
        date: invoice.date,
        pickup: invoice.pickup,
        destination: invoice.destination,
        amount: invoice.amount,
        status: invoice.status,
        vehicleType: invoice.vehicleType,
        passengerCount: invoice.passengerCount,
        distance: invoice.distance
      };
      
      await generateInvoicePDF(bookingForInvoice);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
    
    setActiveRow(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Billing & Invoices</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your travel invoices
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/booking/new")}>
            New Booking
          </Button>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search invoices..."
                    className="pl-9 w-[250px]"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Invoice #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        No invoices found. Create a booking to generate an
                        invoice.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 relative"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {invoice.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">{invoice.date}</td>
                        <td className="px-6 py-4">${invoice.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-primary hover:text-primary/80 flex items-center space-x-1"
                              onClick={() => handleDownloadPDF(invoice)}
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </button>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                    onClick={() =>
                                      setActiveRow(
                                        activeRow === invoice.id
                                          ? null
                                          : invoice.id
                                      )
                                    }
                                  >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">More actions</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {activeRow === invoice.id && (
                              <div className="absolute right-16 top-3 bg-white shadow-lg rounded-md border z-10 py-1 px-2">
                                <div className="flex items-center justify-between pb-1">
                                  <p className="text-xs font-semibold">
                                    Actions
                                  </p>
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
                                    onClick={() => handleEdit(invoice)}
                                  >
                                    <Pencil className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs">Edit</span>
                                  </button>
                                  <button
                                    className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full rounded text-left"
                                    onClick={() => handleDeletePrompt(invoice)}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                    <span className="text-xs">Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          View Billing History
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="mb-4">
                Access your complete billing history and download invoices for
                your records.
              </p>
              <Button variant="outline">View Full History</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default Billing;
