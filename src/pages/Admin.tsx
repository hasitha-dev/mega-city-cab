
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Users, Settings, AlertTriangle, BarChart, Plus, Search, Filter, Map, User } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('vehicles');

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to dashboard if not an admin
  if (!loading && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleAddVehicle = () => {
    toast.success("Vehicle added successfully!");
  };

  const handleAddDriver = () => {
    toast.success("Driver added successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
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
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 in maintenance
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
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
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
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
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="vehicles" onClick={() => setActiveTab('vehicles')}>Vehicles</TabsTrigger>
              <TabsTrigger value="drivers" onClick={() => setActiveTab('drivers')}>Drivers</TabsTrigger>
              <TabsTrigger value="analytics" onClick={() => setActiveTab('analytics')}>Analytics</TabsTrigger>
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
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddVehicle}>
                  <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Vehicle ID</th>
                          <th scope="col" className="px-6 py-3">Model</th>
                          <th scope="col" className="px-6 py-3">License Plate</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">Last Maintenance</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'V-1001', model: 'Toyota Camry', plate: 'ABC-1234', status: 'Available', maintenance: '2023-04-15' },
                          { id: 'V-1002', model: 'Honda Accord', plate: 'XYZ-5678', status: 'In Use', maintenance: '2023-03-22' },
                          { id: 'V-1003', model: 'Ford Explorer', plate: 'DEF-9101', status: 'Maintenance', maintenance: '2023-05-10' },
                          { id: 'V-1004', model: 'Tesla Model 3', plate: 'GHI-1121', status: 'Available', maintenance: '2023-02-18' },
                          { id: 'V-1005', model: 'Hyundai Sonata', plate: 'JKL-3141', status: 'In Use', maintenance: '2023-04-01' },
                        ].map((vehicle) => (
                          <tr key={vehicle.id} className="bg-white hover:bg-amber-50 border-b">
                            <td className="px-6 py-4 font-medium">{vehicle.id}</td>
                            <td className="px-6 py-4">{vehicle.model}</td>
                            <td className="px-6 py-4">{vehicle.plate}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                                vehicle.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {vehicle.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">{vehicle.maintenance}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="drivers">
              <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search drivers..."
                      className="pl-9 w-[250px]"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="on-duty">On Duty</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                      <SelectItem value="on-trip">On Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddDriver}>
                  <Plus className="mr-2 h-4 w-4" /> Add Driver
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted">
                        <tr>
                          <th scope="col" className="px-6 py-3">Driver ID</th>
                          <th scope="col" className="px-6 py-3">Name</th>
                          <th scope="col" className="px-6 py-3">Phone</th>
                          <th scope="col" className="px-6 py-3">License</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'D-2001', name: 'John Smith', phone: '(555) 123-4567', license: 'DL-98765', status: 'On Duty' },
                          { id: 'D-2002', name: 'Sarah Johnson', phone: '(555) 234-5678', license: 'DL-87654', status: 'Off Duty' },
                          { id: 'D-2003', name: 'Michael Brown', phone: '(555) 345-6789', license: 'DL-76543', status: 'On Trip' },
                          { id: 'D-2004', name: 'Emily Davis', phone: '(555) 456-7890', license: 'DL-65432', status: 'On Duty' },
                          { id: 'D-2005', name: 'David Wilson', phone: '(555) 567-8901', license: 'DL-54321', status: 'Off Duty' },
                        ].map((driver) => (
                          <tr key={driver.id} className="bg-white hover:bg-amber-50 border-b">
                            <td className="px-6 py-4 font-medium">{driver.id}</td>
                            <td className="px-6 py-4">{driver.name}</td>
                            <td className="px-6 py-4">{driver.phone}</td>
                            <td className="px-6 py-4">{driver.license}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                driver.status === 'On Duty' ? 'bg-green-100 text-green-800' :
                                driver.status === 'On Trip' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {driver.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
                      <p className="text-muted-foreground">Interactive booking statistics chart will be available here</p>
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
                      <p className="text-muted-foreground">Interactive vehicle usage chart will be available here</p>
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
                      <p className="text-muted-foreground">Interactive revenue chart will be available here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {activeTab === 'vehicles' && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
                <CardDescription>Enter the details of the new vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Vehicle Model</Label>
                    <Input id="model" placeholder="e.g. Toyota Camry" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate">License Plate</Label>
                    <Input id="plate" placeholder="e.g. ABC-1234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" placeholder="e.g. 2023" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" placeholder="e.g. 5" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-use">In Use</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Last Maintenance Date</Label>
                    <Input id="maintenance" type="date" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button onClick={handleAddVehicle}>Add Vehicle</Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {activeTab === 'drivers' && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Driver</CardTitle>
                <CardDescription>Enter the details of the new driver</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Full Name</Label>
                    <Input id="driverName" placeholder="e.g. John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="e.g. (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="e.g. driver@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input id="license" placeholder="e.g. DL-12345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverStatus">Status</Label>
                    <Select>
                      <SelectTrigger id="driverStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-duty">On Duty</SelectItem>
                        <SelectItem value="off-duty">Off Duty</SelectItem>
                        <SelectItem value="on-trip">On Trip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input id="joiningDate" type="date" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button onClick={handleAddDriver}>Add Driver</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
