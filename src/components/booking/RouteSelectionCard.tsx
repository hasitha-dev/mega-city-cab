import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Navigation,
  Route,
  ArrowRight,
  CalendarClock,
  Users,
  Car,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RouteSelectionCardProps {
  mapCenter: [number, number];
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
  passengers: number;
  distance: number | null;
  selectionStep: "pickup" | "destination";
  handleLocationSelect: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
  handleRouteSelect: (start: [number, number], end: [number, number]) => void;
}

const RouteSelectionCard: React.FC<RouteSelectionCardProps> = ({
  pickupLocation,
  destination,
  pickupDate,
  pickupTime,
  vehicleType,
  passengers,
  distance,
}) => {
  return (
    <Card className="bg-card overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-0 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Route className="h-5 w-5 text-primary" />
          Trip Summary
        </CardTitle>
        <CardDescription>Your selected route information</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {pickupLocation && destination ? (
          <div className="space-y-5">
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500 ml-[7px]"></div>

              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="pl-4">
                    <span className="text-xs font-medium uppercase text-blue-500 block">
                      Pickup
                    </span>
                    <p className="text-sm font-medium break-words">
                      {pickupLocation}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="pl-4">
                    <span className="text-xs font-medium uppercase text-green-500 block">
                      Destination
                    </span>
                    <p className="text-sm font-medium break-words">
                      {destination}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <CalendarClock className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <span className="text-xs text-muted-foreground uppercase">
                    Schedule
                  </span>
                  <p className="text-sm">
                    {pickupDate} at {pickupTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Car className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <span className="text-xs text-muted-foreground uppercase">
                    Vehicle
                  </span>
                  <p className="text-sm capitalize">{vehicleType}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Users className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <span className="text-xs text-muted-foreground uppercase">
                    Passengers
                  </span>
                  <p className="text-sm">
                    {passengers} passenger{passengers !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {distance !== null && (
                <div className="flex items-start space-x-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase">
                      Distance
                    </span>
                    <p className="text-sm">{distance.toFixed(2)} km</p>
                  </div>
                </div>
              )}
            </div>

            {distance !== null && (
              <div className="p-3 bg-primary/5 rounded-md">
                <p className="text-xs text-center">
                  Fare estimate:{" "}
                  <span className="font-semibold">
                    LKR{" "}
                    {(
                      distance *
                        (vehicleType === "Sedan"
                          ? 100
                          : vehicleType === "suv"
                          ? 150
                          : vehicleType === "van"
                          ? 200
                          : 300) +
                      (vehicleType === "Sedan"
                        ? 200
                        : vehicleType === "suv"
                        ? 300
                        : vehicleType === "van"
                        ? 400
                        : 600)
                    ).toFixed(2)}
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-center space-y-2">
            <Route className="h-10 w-10 mx-auto text-muted" />
            <p className="text-sm text-muted-foreground">
              Select your pickup and destination locations to see route details
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteSelectionCard;
