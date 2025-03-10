
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, CreditCard, Download } from 'lucide-react';

const Billing = () => {
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
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground mt-2">
            Manage your invoices and payment methods
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$245.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due in 15 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 pending payments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Credit/Debit cards on file
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$89.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Processed on May 15, 2023
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Recent Invoices</h2>
        <Card>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Invoice #</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Amount</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'INV-1001', date: '2023-05-15', amount: '$89.00', status: 'Paid' },
                    { id: 'INV-1002', date: '2023-05-22', amount: '$145.00', status: 'Pending' },
                    { id: 'INV-1003', date: '2023-05-28', amount: '$100.00', status: 'Pending' },
                  ].map((invoice) => (
                    <tr key={invoice.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{invoice.id}</td>
                      <td className="px-6 py-4">{invoice.date}</td>
                      <td className="px-6 py-4">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:text-primary/80 flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Visa ending in 4242</CardTitle>
                <CardDescription>Expires 05/2025</CardDescription>
              </div>
              <div className="bg-primary/10 p-2 rounded-md">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <button className="text-sm text-primary hover:underline">Edit</button>
                <button className="text-sm text-destructive hover:underline">Remove</button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Mastercard ending in 8888</CardTitle>
                <CardDescription>Expires 09/2024</CardDescription>
              </div>
              <div className="bg-primary/10 p-2 rounded-md">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <button className="text-sm text-primary hover:underline">Edit</button>
                <button className="text-sm text-destructive hover:underline">Remove</button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Add a new payment method</p>
              <button className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm">
                Add Payment Method
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;
