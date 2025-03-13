
import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Car,
  Users,
  FileDown,
  Eye,
} from "lucide-react";
import html2canvas from "html2canvas";

interface InvoiceDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    pickupLocation: string;
    destination: string;
    pickupDate: string;
    pickupTime: string;
    vehicleType: string;
    passengers: number;
    distance: number | null;
  };
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  isOpen,
  onClose,
  bookingDetails,
}) => {
  const {
    pickupLocation,
    destination,
    pickupDate,
    pickupTime,
    vehicleType,
    passengers,
    distance,
  } = bookingDetails;

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Function to download the invoice as PNG
  const downloadAsImage = () => {
    if (invoiceRef.current) {
      html2canvas(invoiceRef.current).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `ride-invoice-${new Date().getTime()}.png`;
        link.click();
      });
    }
  };

  const calculateFare = () => {
    const baseFares = {
      sedan: 200,
      suv: 300,
      van: 400,
      luxury: 600,
    };
    
    const ratePerKm = {
      sedan: 50,
      suv: 65,
      van: 80,
      luxury: 100,
    };
    
    const vehicle = vehicleType as keyof typeof baseFares;
    const baseFare = baseFares[vehicle] || 200;
    const rate = ratePerKm[vehicle] || 50;
    const distanceValue = distance || 0;
    
    return baseFare + rate * distanceValue;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <Receipt className="h-5 w-5 mr-2 text-primary" />
            Ride Invoice Details
          </DialogTitle>
          <DialogDescription>
            Complete breakdown of your trip fare and details
          </DialogDescription>
        </DialogHeader>

        <div ref={invoiceRef} className="bg-white p-4 rounded-lg">
          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-primary">Ride Invoice</h2>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-md font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  Trip Information
                </h3>

                <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start space-x-3">
                    <div className="min-w-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Pickup Location
                      </span>
                      <p className="text-sm text-gray-600">{pickupLocation}</p>
                    </div>
                  </div>

                  <div className="relative ml-3 pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="min-w-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Navigation className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Destination
                      </span>
                      <p className="text-sm text-gray-600">{destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Booking Details
                    </h3>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500">Date</span>
                          <p className="text-sm font-medium">{pickupDate}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Time</span>
                          <p className="text-sm font-medium">{pickupTime}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-500">Vehicle</span>
                          <p className="text-sm font-medium capitalize">{vehicleType}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Passengers</span>
                          <p className="text-sm font-medium">{passengers}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-semibold flex items-center">
                      <Receipt className="h-4 w-4 mr-2 text-gray-500" />
                      Fare Breakdown
                    </h3>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Distance</span>
                        <span className="text-sm font-medium">
                          {distance?.toFixed(2) || 0} km
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base fare</span>
                        <span className="text-sm font-medium">
                          LKR {{
                            sedan: "200",
                            suv: "300",
                            van: "400",
                            luxury: "600",
                          }[vehicleType || 'sedan']}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rate per km</span>
                        <span className="text-sm font-medium">
                          LKR {{
                            sedan: "50",
                            suv: "65",
                            van: "80",
                            luxury: "100",
                          }[vehicleType || 'sedan']}
                        </span>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Total</span>
                        <span className="text-primary">
                          LKR {calculateFare().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800">
                <p className="text-center">
                  Final fare may vary based on actual route, traffic conditions,
                  and waiting time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Close
          </Button>
          <Button
            onClick={downloadAsImage}
            className="w-full sm:w-auto flex items-center gap-2 order-1 sm:order-2"
          >
            <FileDown className="h-4 w-4" />
            Download as PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetails;
