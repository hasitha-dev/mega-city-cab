import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Users,
  Settings,
  AlertTriangle,
  BarChart,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface Vehicle {
  vehicle_id?: string;
  vehicle_number: string;
  vehicle_type: "SEDAN" | "SUV" | "VAN" | "LUXURY";
  status: "AVAILABLE" | "UNAVAILABLE" | "active";
  driver_id?: string;
  driver_name: string;
  driver_contact: string;
  driver_nic: string;
  driver_email: string;
}

const Admin = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [vehicleData, setVehicleData] = useState<Vehicle>({
    vehicle_number: "",
    vehicle_type: "SEDAN",
    status: "AVAILABLE",
    driver_name: "",
    driver_contact: "",
    driver_nic: "",
    driver_email: "",
  });

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      console.log("Token", localStorage.getItem("accessToken"));

      const response = await fetch("http://localhost:8070/api/vehicle", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Data", data.data);
        const dataArr = JSON.parse(data.data);
        if (Array.isArray(dataArr)) {
          const vehicles: Vehicle[] = dataArr.map((v: any) => ({
            vehicle_id: v.vehicle_id,
            vehicle_number: v.vehicle_number,
            vehicle_type: v.vehicle_type,
            status: v.status,
            driver_id: v.driver_id,
            driver_name: v.driver_name,
            driver_contact: v.driver_contact,
            driver_nic: v.driver_nic,
            driver_email: v.driver_email,
          }));
          setVehicles(vehicles);
        } else {
          console.error("data.data is not an array", typeof dataArr);
          toast.error("Unexpected response format");
        }
      } else {
        toast.error("Failed to fetch vehicles");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "vehicles") {
      fetchVehicles();
    }
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleData({ ...vehicleData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setVehicleData({ ...vehicleData, [field]: value });
  };

  const handleAddVehicle = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token", token);

      const vehiclePayload = {
        vehicle_number: vehicleData.vehicle_number,
        vehicle_type: vehicleData.vehicle_type,
        status: "active",
        driver_name: vehicleData.driver_name,
        driver_contact: vehicleData.driver_contact,
        driver_nic: vehicleData.driver_nic,
        driver_email: vehicleData.driver_email,
      };

      const response = await fetch("http://localhost:8070/api/vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehiclePayload),
      });

      if (response.ok) {
        toast.success("Vehicle added successfully");
        fetchVehicles();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to add vehicle: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to connect to the server");
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicleData({
      vehicle_id: vehicle.vehicle_id,
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type,
      status: vehicle.status,
      driver_id: vehicle.driver_id,
      driver_name: vehicle.driver_name,
      driver_contact: vehicle.driver_contact,
      driver_nic: vehicle.driver_nic,
      driver_email: vehicle.driver_email,
    });
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle?.vehicle_id) return;

    try {
      const response = await fetch(
        `http://localhost:8070/api/vehicle/${selectedVehicle.vehicle_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
      } else {
        toast.error("Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to connect to the server");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedVehicle(null);
    }
  };

  const resetForm = () => {
    setVehicleData({
      vehicle_number: "",
      vehicle_type: "SEDAN",
      status: "AVAILABLE",
      driver_name: "",
      driver_contact: "",
      driver_nic: "",
      driver_email: "",
    });
  };

  if (!loading && !isAuthenticated) {
    console.log("Not authenticated");
    return <Navigate to="/login" />;
  }

  if (!loading && user?.role !== "admin") {
    console.log(user);
    console.log("Not an admin");
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b bg-black/30">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage vehicles, drivers, and system configurations
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vehicles
              </CardTitle>
              <Car className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{vehicles.length || 0}</div>
              {/* <p className="text-xs text-muted-foreground mt-1">
                {(vehicles &&
                  vehicles.filter((v) => v.status === "MAINTENANCE").length) ||
                  0}{" "}
                in maintenance
              </p> */}
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Drivers
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                18 currently on duty
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <Settings className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Operational</div>
              <p className="text-xs text-muted-foreground mt-1">
                All systems running normally
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="vehicles" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger
                value="vehicles"
                onClick={() => setActiveTab("vehicles")}
              >
                Vehicles
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles">
              <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search vehicles..."
                      className="pl-9 w-[250px]"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Vehicle ID
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Model/Type
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Vehicle Number
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Driver Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">
                              Loading vehicles...
                            </td>
                          </tr>
                        ) : vehicles.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">
                              No vehicles found. Add your first vehicle below.
                            </td>
                          </tr>
                        ) : (
                          vehicles.map((vehicle) => (
                            <tr
                              key={vehicle.vehicle_id}
                              className="bg-slate-700 border-b"
                            >
                              <td className="px-6 py-4 font-medium">
                                {vehicle.vehicle_id?.substring(0, 8) || "N/A"}
                              </td>
                              <td className="px-6 py-4 capitalize">
                                {vehicle.vehicle_type.toLowerCase()}
                              </td>
                              <td className="px-6 py-4">
                                {vehicle.vehicle_number}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    vehicle.status === "AVAILABLE"
                                      ? "bg-green-100 text-green-800"
                                      : vehicle.status === "UNAVAILABLE"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {vehicle.status.charAt(0) +
                                    vehicle.status.slice(1).toLowerCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {vehicle.driver_name}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditVehicle(vehicle)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteClick(vehicle)}
                                  >
                                    Delete
                                  </Button>
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
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Statistics</CardTitle>
                    <CardDescription>Weekly booking overview</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <BarChart className="h-16 w-16 text-primary mb-4" />
                      <p className="text-muted-foreground">
                        Interactive booking statistics chart will be available
                        here
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Usage</CardTitle>
                    <CardDescription>Fleet utilization metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <BarChart className="h-16 w-16 text-primary mb-4" />
                      <p className="text-muted-foreground">
                        Interactive vehicle usage chart will be available here
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <BarChart className="h-16 w-16 text-primary mb-4" />
                      <p className="text-muted-foreground">
                        Interactive revenue chart will be available here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {activeTab === "vehicles" && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
                <CardDescription>
                  Enter the details of the new vehicle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_number">Vehicle Number</Label>
                    <Input
                      id="vehicle_number"
                      placeholder="e.g. ABC-1234"
                      value={vehicleData.vehicle_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Select
                      value={vehicleData.vehicle_type}
                      onValueChange={(value) =>
                        handleSelectChange("vehicle_type", value)
                      }
                    >
                      <SelectTrigger id="vehicle_type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEDAN">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="VAN">Van</SelectItem>
                        <SelectItem value="LUXURY">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={vehicleData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="driver_name">Driver Name</Label>
                    <Input
                      placeholder="e.g. John Smith"
                      id="driver_name"
                      type="text"
                      value={vehicleData.driver_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_contact">Driver Contact</Label>
                    <Input
                      placeholder="e.g. (555) 123-4567"
                      id="driver_contact"
                      type="tel"
                      value={vehicleData.driver_contact}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_nic">Driver NIC</Label>
                    <Input
                      placeholder="e.g. 123456789V"
                      id="driver_nic"
                      type="text"
                      value={vehicleData.driver_nic}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver_email">Driver Email</Label>
                    <Input
                      placeholder="e.g. john@example.com"
                      id="driver_email"
                      type="email"
                      value={vehicleData.driver_email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleAddVehicle}>
                  {vehicleData.vehicle_id ? "Update Vehicle" : "Add Vehicle"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Vehicle"
          description="Are you sure you want to delete this vehicle? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </div>
  );
};

export default Admin;
