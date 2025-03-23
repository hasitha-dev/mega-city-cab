import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Trash2, X, AlertTriangle, MapPin } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import LocationInput from "@/components/map/LocationInput";
import { calculateFare } from "@/utils/mapUtils";
import MapComponent from "@/components/MapComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: (data: any) => void;
  item: any;
}

const EditPopup: React.FC<EditPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  item,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectionStep, setSelectionStep] = useState<"pickup" | "destination">(
    "pickup"
  );
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });

      // Reset map points when a new item is loaded
      if (item.startPoint) {
        setStartPoint(item.startPoint);
      }
      if (item.endPoint) {
        setEndPoint(item.endPoint);
      }
      if (item.distance) {
        setDistance(item.distance);
      }
    }
  }, [item]);

  useEffect(() => {
    // Recalculate fare when distance or vehicle type changes
    if (distance && formData.vehicleType) {
      const newFare = calculateFare(distance, formData.vehicleType);
      setFare(newFare);

      // Update formData with the new fare
      setFormData((prev) => ({
        ...prev,
        fare: newFare,
      }));
    }
  }, [distance, formData.vehicleType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    if (selectionStep === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickupLocation: location.name,
      }));
      setStartPoint([location.lat, location.lng]);
      setSelectionStep("destination");
    } else {
      setFormData((prev) => ({
        ...prev,
        destination: location.name,
      }));
      setEndPoint([location.lat, location.lng]);
      setSelectionStep("pickup");

      // Calculate distance if both points are available
      if (startPoint) {
        handleRouteSelect(startPoint, [location.lat, location.lng]);
      }
    }
  };

  const handleRouteSelect = (
    start: [number, number],
    end: [number, number]
  ) => {
    // Calculate distance in kilometers (simple straight-line distance)
    const R = 6371; // Radius of the Earth in km
    const dLat = ((end[0] - start[0]) * Math.PI) / 180;
    const dLon = ((end[1] - start[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((start[0] * Math.PI) / 180) *
        Math.cos((end[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const newDistance = R * c; // Distance in km

    setDistance(newDistance);
    setFormData((prev) => ({
      ...prev,
      distance: newDistance,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.pickupLocation || !formData.destination) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Update form data with map-related information
    const updatedData = {
      ...formData,
      startPoint,
      endPoint,
      distance,
      fare,
    };

    onSave(updatedData);
  };

  const handleDelete = () => {
    onDelete(item);
    onClose();
    setIsDeleteDialogOpen(false);
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] bg-card text-card-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-primary" />
              Edit Booking
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 hover:bg-secondary/50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Booking Details</TabsTrigger>
              <TabsTrigger value="map">Location & Map</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation || ""}
                    onChange={handleChange}
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination || ""}
                    onChange={handleChange}
                    className="bg-background"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      name="pickupDate"
                      type="date"
                      value={formData.pickupDate || ""}
                      onChange={handleChange}
                      className="bg-background"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Input
                      id="pickupTime"
                      name="pickupTime"
                      type="time"
                      value={formData.pickupTime || ""}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      value={formData.vehicleType || ""}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border bg-background rounded-md"
                    >
                      <option value="">Select Vehicle</option>
                      <option value="SEDAN">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="VAN">Van</option>
                      <option value="LUXURY">Luxury</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers">Passengers</Label>
                    <Input
                      id="passengers"
                      name="passengers"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.passengers || "1"}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                </div>

                {distance && fare && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="ml-2 font-medium">
                          {distance.toFixed(2)} km
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">New Fare:</span>
                        <span className="ml-2 font-medium text-primary">
                          LKR {fare.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </TabsContent>

            <TabsContent value="map" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    {selectionStep === "pickup"
                      ? "Select Pickup Location"
                      : "Select Destination"}
                  </Label>

                  <LocationInput
                    value={
                      selectionStep === "pickup"
                        ? formData.pickupLocation || ""
                        : formData.destination || ""
                    }
                    onChange={(value) => {
                      if (selectionStep === "pickup") {
                        setFormData((prev) => ({
                          ...prev,
                          pickupLocation: value,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          destination: value,
                        }));
                      }
                    }}
                    onLocationSelect={handleLocationSelect}
                    placeholder={
                      selectionStep === "pickup"
                        ? "Enter pickup address"
                        : "Enter destination address"
                    }
                    label={
                      selectionStep === "pickup"
                        ? "Pickup Location"
                        : "Destination"
                    }
                    selectionStep={selectionStep}
                  />
                </div>

                <div className="h-[300px] rounded-lg overflow-hidden border">
                  <MapComponent
                    center={[6.9271, 79.8612]} // Default to Colombo
                    zoom={12}
                    className="h-full"
                    selectionMode={true}
                    onSelectLocation={handleLocationSelect}
                    selectionStep={selectionStep}
                    onRouteSelect={handleRouteSelect}
                  />
                </div>

                {startPoint && endPoint && (
                  <div className="p-3 bg-primary/5 rounded-md border border-primary/10">
                    <p className="text-sm text-muted-foreground mb-2">
                      Route information:
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm truncate max-w-[200px]">
                          {formData.pickupLocation}
                        </span>
                      </div>
                      <div className="h-px w-16 bg-primary/20 mx-2"></div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm truncate max-w-[200px]">
                          {formData.destination}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center space-x-2 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};

export default EditPopup;
