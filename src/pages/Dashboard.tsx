
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, MapPin, CalendarCheck, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
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
              <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
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
              <CardTitle className="text-sm font-medium">On-duty Drivers</CardTitle>
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
                    <th scope="col" className="px-6 py-3">Booking ID</th>
                    <th scope="col" className="px-6 py-3">Pickup</th>
                    <th scope="col" className="px-6 py-3">Destination</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'B-1291', pickup: '123 Main St', destination: '456 Oak Ave', date: '2023-05-21', status: 'Completed' },
                    { id: 'B-1292', pickup: '789 Pine Rd', destination: '101 Maple Dr', date: '2023-05-23', status: 'Scheduled' },
                    { id: 'B-1293', pickup: '222 Cedar Ln', destination: '333 Birch Ct', date: '2023-05-25', status: 'In Progress' },
                  ].map((booking) => (
                    <tr key={booking.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{booking.id}</td>
                      <td className="px-6 py-4">{booking.pickup}</td>
                      <td className="px-6 py-4">{booking.destination}</td>
                      <td className="px-6 py-4">{booking.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
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
