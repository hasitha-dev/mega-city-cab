
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onSelectLocation: (location: Location) => void;
  placeholder: string;
}

// Mock function to simulate geocoding API
const mockGeocodeSearch = async (query: string): Promise<Location[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock locations based on query
  if (!query) return [];
  
  return [
    {
      address: `${query} Main St, San Francisco, CA`,
      lat: 37.7749 + Math.random() * 0.02 - 0.01,
      lng: -122.4194 + Math.random() * 0.02 - 0.01
    },
    {
      address: `${query} Market St, San Francisco, CA`,
      lat: 37.7835 + Math.random() * 0.02 - 0.01,
      lng: -122.4089 + Math.random() * 0.02 - 0.01
    },
    {
      address: `${query} Valencia St, San Francisco, CA`,
      lat: 37.7599 + Math.random() * 0.02 - 0.01,
      lng: -122.4212 + Math.random() * 0.02 - 0.01
    }
  ];
};

const MapPicker: React.FC<MapPickerProps> = ({ onSelectLocation, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setSearching(true);
      const results = await mockGeocodeSearch(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching for location:', error);
      toast.error('Error searching for location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    setSearchQuery(location.address);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          className="pr-10"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full" 
          onClick={handleSearch}
          disabled={searching}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {searchResults.map((result, index) => (
              <li 
                key={index} 
                className="px-4 py-2 hover:bg-secondary cursor-pointer flex items-center"
                onClick={() => handleSelectLocation(result)}
              >
                <MapPin className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{result.address}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
