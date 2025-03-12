
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { calculateFare } from '@/utils/mapUtils';
import { Receipt, MapPin, Navigation, Calendar, Clock, Car, Users } from 'lucide-react';

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
  bookingDetails
}) => {
  const { 
    pickupLocation, 
    destination, 
    pickupDate, 
    pickupTime, 
    vehicleType, 
    passengers, 
    distance 
  } = bookingDetails;
  
  const estimatedFare = distance && vehicleType 
    ? calculateFare(distance, vehicleType) 
    : 0;
  
  const serviceFee = estimatedFare * 0.05;
  const totalFare = estimatedFare + serviceFee;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-primary" />
            Ride Estimate
          </DialogTitle>
          <DialogDescription>
            Detailed fare breakdown for your trip
          </DialogDescription>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Pickup Location</span>
                  <p className="text-sm text-gray-600">{pickupLocation}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Navigation className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Destination</span>
                  <p className="text-sm text-gray-600">{destination}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date</span>
                    <p className="text-sm text-gray-600">{pickupDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Time</span>
                    <p className="text-sm text-gray-600">{pickupTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Car className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Vehicle</span>
                    <p className="text-sm text-gray-600">{vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Passengers</span>
                    <p className="text-sm text-gray-600">{passengers}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Fare Breakdown</h3>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Distance</span>
                <span className="text-sm font-medium">{distance?.toFixed(2) || 0} km</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Base Fare</span>
                <span className="text-sm font-medium">Rs. {estimatedFare.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service Fee (5%)</span>
                <span className="text-sm font-medium">Rs. {serviceFee.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-base font-semibold">Total Estimated Fare</span>
                <span className="text-base font-semibold">Rs. {totalFare.toFixed(2)}</span>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800">
                <p>Final fare may vary based on actual route, traffic conditions, and waiting time.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetails;
