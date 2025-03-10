
import { toast } from 'sonner';

// Types
export interface Booking {
  id: string;
  userId: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  carId?: string;
  driverId?: string;
  createdAt: string;
}

export interface Car {
  id: string;
  model: string;
  licensePlate: string;
  capacity: number;
  type: string;
  status: 'available' | 'in-use' | 'maintenance';
  imageUrl: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'off-duty';
  rating: number;
}

export interface Bill {
  id: string;
  bookingId: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid';
  createdAt: string;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '2',
    pickupAddress: '123 Main St, Anytown, USA',
    pickupLat: 37.7749,
    pickupLng: -122.4194,
    destinationAddress: '456 Market St, Anytown, USA',
    destinationLat: 37.7920,
    destinationLng: -122.4100,
    bookingTime: '2023-06-15T14:30:00Z',
    status: 'completed',
    carId: '1',
    driverId: '1',
    createdAt: '2023-06-14T12:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    pickupAddress: '789 Oak St, Anytown, USA',
    pickupLat: 37.7749,
    pickupLng: -122.4194,
    destinationAddress: '101 Pine St, Anytown, USA',
    destinationLat: 37.7920,
    destinationLng: -122.4100,
    bookingTime: '2023-06-18T09:15:00Z',
    status: 'confirmed',
    carId: '2',
    driverId: '2',
    createdAt: '2023-06-16T10:30:00Z'
  },
  {
    id: '3',
    userId: '2',
    pickupAddress: '202 Maple Ave, Anytown, USA',
    pickupLat: 37.7749,
    pickupLng: -122.4194,
    destinationAddress: '303 Birch Blvd, Anytown, USA',
    destinationLat: 37.7920,
    destinationLng: -122.4100,
    bookingTime: '2023-06-20T16:45:00Z',
    status: 'pending',
    createdAt: '2023-06-19T14:20:00Z'
  }
];

const mockCars: Car[] = [
  {
    id: '1',
    model: 'Tesla Model 3',
    licensePlate: 'ABC123',
    capacity: 4,
    type: 'electric',
    status: 'available',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    model: 'Toyota Camry',
    licensePlate: 'XYZ789',
    capacity: 5,
    type: 'hybrid',
    status: 'available',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    model: 'BMW X5',
    licensePlate: 'DEF456',
    capacity: 5,
    type: 'premium',
    status: 'in-use',
    imageUrl: '/placeholder.svg'
  }
];

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Doe',
    licenseNumber: 'DL12345',
    phone: '555-123-4567',
    email: 'john.doe@example.com',
    status: 'available',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Jane Smith',
    licenseNumber: 'DL67890',
    phone: '555-987-6543',
    email: 'jane.smith@example.com',
    status: 'busy',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Michael Johnson',
    licenseNumber: 'DL24680',
    phone: '555-456-7890',
    email: 'michael.johnson@example.com',
    status: 'available',
    rating: 4.7
  }
];

const mockBills: Bill[] = [
  {
    id: '1',
    bookingId: '1',
    amount: 25.50,
    tax: 2.55,
    discount: 0,
    total: 28.05,
    status: 'paid',
    createdAt: '2023-06-15T15:30:00Z'
  },
  {
    id: '2',
    bookingId: '2',
    amount: 18.75,
    tax: 1.88,
    discount: 2.00,
    total: 18.63,
    status: 'pending',
    createdAt: '2023-06-18T10:15:00Z'
  }
];

// Utility to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const fetchBookings = async (userId?: string): Promise<Booking[]> => {
  try {
    await delay(800);
    if (userId) {
      return mockBookings.filter(booking => booking.userId === userId);
    }
    return mockBookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to fetch bookings. Please try again.');
    throw error;
  }
};

export const fetchBookingById = async (id: string): Promise<Booking | undefined> => {
  try {
    await delay(500);
    return mockBookings.find(booking => booking.id === id);
  } catch (error) {
    console.error('Error fetching booking:', error);
    toast.error('Failed to fetch booking details. Please try again.');
    throw error;
  }
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
  try {
    await delay(1000);
    const newBooking: Booking = {
      ...bookingData,
      id: `${mockBookings.length + 1}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockBookings.push(newBooking);
    toast.success('Booking created successfully.');
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    toast.error('Failed to create booking. Please try again.');
    throw error;
  }
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<Booking> => {
  try {
    await delay(800);
    const booking = mockBookings.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    booking.status = status;
    toast.success(`Booking status updated to ${status}.`);
    return booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    toast.error('Failed to update booking status. Please try again.');
    throw error;
  }
};

export const fetchCars = async (): Promise<Car[]> => {
  try {
    await delay(800);
    return mockCars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    toast.error('Failed to fetch cars. Please try again.');
    throw error;
  }
};

export const fetchDrivers = async (): Promise<Driver[]> => {
  try {
    await delay(800);
    return mockDrivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    toast.error('Failed to fetch drivers. Please try again.');
    throw error;
  }
};

export const fetchBill = async (bookingId: string): Promise<Bill | undefined> => {
  try {
    await delay(600);
    return mockBills.find(bill => bill.bookingId === bookingId);
  } catch (error) {
    console.error('Error fetching bill:', error);
    toast.error('Failed to fetch billing information. Please try again.');
    throw error;
  }
};

export const createCar = async (carData: Omit<Car, 'id'>): Promise<Car> => {
  try {
    await delay(1000);
    const newCar: Car = {
      ...carData,
      id: `${mockCars.length + 1}`
    };
    mockCars.push(newCar);
    toast.success('Car added successfully.');
    return newCar;
  } catch (error) {
    console.error('Error adding car:', error);
    toast.error('Failed to add car. Please try again.');
    throw error;
  }
};

export const createDriver = async (driverData: Omit<Driver, 'id' | 'rating'>): Promise<Driver> => {
  try {
    await delay(1000);
    const newDriver: Driver = {
      ...driverData,
      id: `${mockDrivers.length + 1}`,
      rating: 5.0
    };
    mockDrivers.push(newDriver);
    toast.success('Driver added successfully.');
    return newDriver;
  } catch (error) {
    console.error('Error adding driver:', error);
    toast.error('Failed to add driver. Please try again.');
    throw error;
  }
};
