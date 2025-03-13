
import L from 'leaflet';
import { toast } from 'sonner';

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyAul3w-58LsqLRQ';

// Set bounds for Colombo area (Western Province)
export const colomboBounds = L.latLngBounds(
  [6.7, 79.8], // Southwest corner
  [7.0, 80.0]  // Northeast corner
);

// Function to check if a location is within Colombo bounds
export const isWithinColombo = (latlng: L.LatLng): boolean => {
  return colomboBounds.contains(latlng);
};

// Function to get address from coordinates
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    const data = await response.json();
    
    // Verify location is in Western Province/Colombo area
    const isInColombo = 
      (data.address?.city === 'Colombo') || 
      (data.address?.county === 'Colombo') || 
      (data.address?.state === 'Western Province');
    
    if (!isInColombo) {
      toast.error("Please select a location within Colombo area");
      return '';
    }
    
    return data.display_name || 'Selected Location';
  } catch (error) {
    console.error('Error fetching location info:', error);
    toast.error('Error getting location information. Please try again.');
    return '';
  }
};

// Function to get location suggestions based on search text
export const getLocationSuggestions = async (searchText: string): Promise<any[]> => {
  if (!searchText || searchText.length < 3) return [];
  
  try {
    // Using OpenStreetMap Nominatim for suggestions (free alternative to Google Places)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText + ' Colombo Sri Lanka')}&format=json&addressdetails=1&limit=5`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location suggestions');
    }
    
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.place_id,
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return [];
  }
};

// Function to calculate distance between two points in kilometers
export const calculateDistance = (start: [number, number], end: [number, number]): number => {
  // Convert degrees to radians
  const toRad = (deg: number) => deg * Math.PI / 180;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end[0] - start[0]);
  const dLon = toRad(end[1] - start[1]);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(start[0])) * Math.cos(toRad(end[0])) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Function to calculate fare based on distance and vehicle type
export const calculateFare = (distance: number, vehicleType: string): number => {
  // Base fare depends on vehicle type
  const baseFares: { [key: string]: number } = {
    sedan: 200,
    suv: 300,
    van: 400,
    luxury: 600
  };
  
  // Rate per kilometer depends on vehicle type
  const ratePerKm: { [key: string]: number } = {
    sedan: 50,
    suv: 70,
    van: 90,
    luxury: 120
  };
  
  const baseFare = baseFares[vehicleType] || 200; // Default to sedan fare if vehicle type not found
  const rate = ratePerKm[vehicleType] || 50; // Default to sedan rate if vehicle type not found
  
  // Calculate total fare based on distance
  const distanceFare = distance * rate;
  
  // Return total fare (base fare + distance fare)
  return baseFare + distanceFare;
};
