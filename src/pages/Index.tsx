
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Car, MapPin, User, Sparkles, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const Index = () => {
  // Features section
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Easy Booking',
      description: 'Book your ride in just a few clicks with our intuitive interface.'
    },
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: 'Premium Vehicles',
      description: 'Choose from our fleet of high-quality, well-maintained vehicles.'
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: 'Professional Drivers',
      description: 'Our experienced drivers ensure a safe and comfortable journey.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Secure & Reliable',
      description: 'Track your ride in real-time and enjoy peace of mind throughout your journey.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold mb-4">Premium Vehicle Reservation Experience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge technology with exceptional service to provide you with the best vehicle reservation experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16 flex items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Ready to experience premium transportation?</h2>
                    <p className="text-muted-foreground">
                      Sign in to your account or create a new one to book your next journey with us.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/login">
                        <Button size="lg" className="group">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                      <Link to="/help">
                        <Button variant="outline" size="lg">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Luxury car interior"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Car className="h-6 w-6 text-primary mr-2" />
              <span className="text-primary font-semibold text-xl">VoyageVehicle</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} VoyageVehicle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
