
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircleDashed, Plus, UserCog, Edit, RefreshCw, Star } from 'lucide-react';
import { fetchDrivers, createDriver, Driver } from '@/services/api';

const DriverList = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id' | 'rating'>>({
    name: '',
    licenseNumber: '',
    phone: '',
    email: '',
    status: 'available'
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await fetchDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const driver = await createDriver(newDriver);
      setDrivers([...drivers, driver]);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating driver:', error);
    }
  };

  const resetForm = () => {
    setNewDriver({
      name: '',
      licenseNumber: '',
      phone: '',
      email: '',
      status: 'available'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'off-duty':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full transition-all duration-300 animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Drivers</CardTitle>
          <CardDescription>View and add drivers to your team</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDrivers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newDriver.status}
                    onValueChange={(value) => 
                      setNewDriver({ ...newDriver, status: value as Driver['status'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Save Driver</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <CircleDashed className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : drivers.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No drivers available</h3>
            <p className="text-muted-foreground mb-4">
              Your team is empty. Add your first driver!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {drivers.map((driver) => (
              <Card key={driver.id} className="overflow-hidden hover:border-primary/50 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{driver.name}</h3>
                        <Button variant="ghost" size="icon" className="md:hidden">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">License: {driver.licenseNumber}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className={getStatusColor(driver.status)}>
                            {driver.status}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{driver.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium w-16">Phone:</span>
                        <span className="text-sm">{driver.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium w-16">Email:</span>
                        <span className="text-sm">{driver.email}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverList;
