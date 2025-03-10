
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, MapPin, Clock, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
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
                <Button size="lg" className="group">
                  Book a ride
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
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
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">On-time Service</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">Safe Rides</span>
              </div>
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">Premium Fleet</span>
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
            <div className="absolute bottom-4 right-4 glass border border-white/20 p-4 rounded-lg z-20 shadow-lg max-w-xs">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium">Available now</span>
              </div>
              <p className="text-sm">Premium vehicles ready for your next journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
