
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Car, MapPin, User, Sparkles, Shield, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const Index = () => {
  // Features section
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Easy Booking",
      description:
        "Book your ride in just a few clicks with our intuitive interface.",
    },
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Premium Vehicles",
      description:
        "Choose from our fleet of high-quality, well-maintained vehicles.",
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: "Professional Drivers",
      description:
        "Our experienced drivers ensure a safe and comfortable journey.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Reliable",
      description:
        "Track your ride in real-time and enjoy peace of mind throughout your journey.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      content: "Mega Cabs provided excellent service for my business trip. The driver was professional and the car was immaculate.",
      rating: 5
    },
    {
      name: "Michael Patel",
      role: "Tourist",
      content: "During my vacation in Colombo, I exclusively used Mega Cabs. Their knowledge of the city made my trip much more enjoyable.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Regular Customer",
      content: "I've been using Mega Cabs for my daily commute for over a year. They're always on time and the service is consistently excellent.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section - Updated with gradient background */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/40 to-background">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-slide-up">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-primary mb-4 border border-primary/20">
                    <Car className="w-4 h-4 mr-2" />
                    Premium Vehicle Reservation
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                    Your journey begins with a seamless booking experience
                  </h1>
                  <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                    Book your ride with just a few clicks. We provide reliable, comfortable
                    transportation to get you where you need to go, when you need to be there.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/login">
                    <Button size="lg" className="group bg-primary hover:bg-primary/90">
                      Book a ride
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10">
                      Learn more
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium">GPS Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium">Premium Service</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium">Safe Rides</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium">Luxury Fleet</span>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-fade-in">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent opacity-80 mix-blend-overlay z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Premium luxury car"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-lg z-20 shadow-lg max-w-xs">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Available now</span>
                  </div>
                  <p className="text-sm">Premium vehicles ready for your next journey in Colombo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Premium Vehicle Reservation Experience
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge technology with exceptional service to
                provide you with the best vehicle reservation experience in Colombo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-none shadow-md bg-black/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-white/10"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-secondary/50 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                <Star className="w-4 h-4 mr-2" />
                Testimonials
              </div>
              <h2 className="text-3xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it - hear from some of our satisfied customers
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border border-white/5">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-400'}`} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
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
            <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/10">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16 flex items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold">
                      Ready to experience premium transportation?
                    </h2>
                    <p className="text-muted-foreground">
                      Sign in to your account or create a new one to book your
                      next journey with us.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/login">
                        <Button size="lg" className="group">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                      <Link to="/help">
                        <Button variant="outline" size="lg" className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10">
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
                      e.currentTarget.src = "/placeholder.svg";
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
              <span className="text-primary font-semibold text-xl">
                Mega Cabs
              </span>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Mega Cabs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
