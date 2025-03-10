
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Users, Settings, AlertTriangle, BarChart } from 'lucide-react';

const Admin = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 px-4 pb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage vehicles, drivers, and system configurations
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
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
          
          <Card>
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
          
          <Card>
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
          
          <Card>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vehicle Management</CardTitle>
              <CardDescription>Add, update, or remove vehicles from the fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Vehicle ID</th>
                      <th scope="col" className="px-6 py-3">Model</th>
                      <th scope="col" className="px-6 py-3">License Plate</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Last Maintenance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'V-1001', model: 'Toyota Camry', plate: 'ABC-1234', status: 'Available', maintenance: '2023-04-15' },
                      { id: 'V-1002', model: 'Honda Accord', plate: 'XYZ-5678', status: 'In Use', maintenance: '2023-03-22' },
                      { id: 'V-1003', model: 'Ford Explorer', plate: 'DEF-9101', status: 'Maintenance', maintenance: '2023-05-10' },
                    ].map((vehicle) => (
                      <tr key={vehicle.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{vehicle.id}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>Add, update, or remove drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Driver ID</th>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'D-2001', name: 'John Smith', status: 'On Duty' },
                      { id: 'D-2002', name: 'Sarah Johnson', status: 'Off Duty' },
                      { id: 'D-2003', name: 'Michael Brown', status: 'On Trip' },
                    ].map((driver) => (
                      <tr key={driver.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{driver.id}</td>
                        <td className="px-6 py-4">{driver.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            driver.status === 'On Duty' ? 'bg-green-100 text-green-800' :
                            driver.status === 'On Trip' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {driver.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Overview of system performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Interactive analytics dashboard will be available here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
