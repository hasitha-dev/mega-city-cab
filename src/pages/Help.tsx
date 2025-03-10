
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, FileText, MessageSquare, Phone } from 'lucide-react';

const Help = () => {
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
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions or contact support
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>FAQs</CardTitle>
              <HelpCircle className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Find answers to the most common questions about our vehicle reservation system.
              </p>
              <button className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors w-full">
                View FAQs
              </button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documentation</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access detailed guides and documentation for using our platform.
              </p>
              <button className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors w-full">
                Read Guides
              </button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contact Support</CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get in touch with our customer support team for personalized assistance.
              </p>
              <button className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors w-full">
                Contact Us
              </button>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-8">
          {[
            {
              question: "How do I book a vehicle?",
              answer: "To book a vehicle, log in to your account, navigate to the Booking page, fill out the required information including pickup location, destination, date, and time, then click 'Book Vehicle'."
            },
            {
              question: "What payment methods are accepted?",
              answer: "We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover. You can manage your payment methods in the Billing section."
            },
            {
              question: "How can I cancel a reservation?",
              answer: "You can cancel a reservation by going to the Dashboard, finding your booking in the 'Recent Bookings' section, and clicking the cancel button. Cancellations made at least 24 hours in advance are eligible for a full refund."
            },
            {
              question: "What if I need to change my reservation details?",
              answer: "To modify your reservation, go to the Dashboard, find your booking, and click on the edit button. You can change details like pickup time, location, or vehicle type, subject to availability."
            },
            {
              question: "Is there a mobile app available?",
              answer: "Yes, we offer mobile apps for both iOS and Android. You can download them from the App Store or Google Play Store. The mobile app offers all the features available on the web platform."
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-muted-foreground text-sm">+1 (800) 123-4567</p>
                  <p className="text-muted-foreground text-sm">Monday-Friday, 9AM-5PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-muted-foreground text-sm">support@voyagevehicle.com</p>
                  <p className="text-muted-foreground text-sm">24/7 response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-muted-foreground text-sm">Available on our website</p>
                  <p className="text-muted-foreground text-sm">24/7 instant support</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
