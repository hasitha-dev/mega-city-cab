
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLocationSuggestions } from '@/utils/mapUtils';
import { MapPin, Loader2, Map } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import MapComponent from '@/components/MapComponent';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
  placeholder: string;
  label: string;
  selectionStep?: 'pickup' | 'destination';
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder,
  label,
  selectionStep = 'pickup'
}) => {
  const [suggestions, setSuggestions] = useState<Array<{id: string, name: string, lat: number, lng: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getLocationSuggestions(value);
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: {id: string, name: string, lat: number, lng: number}) => {
    onChange(suggestion.name);
    onLocationSelect({
      lat: suggestion.lat,
      lng: suggestion.lng,
      name: suggestion.name
    });
    setShowSuggestions(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-primary/10', 'border-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-primary/10', 'border-primary');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/10', 'border-primary');
    
    // This is a simplified example - in a real app, you'd parse coordinates from the dropped data
    // For now, we'll just show a notification that this feature is coming soon
    alert('Drop functionality coming soon! You can use the map button to select a location.');
  };

  const handleMapLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    onChange(location.name);
    onLocationSelect(location);
    setIsMapOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium block mb-1">
        {label}
        {selectionStep === 'pickup' && label.toLowerCase().includes('pickup') && (
          <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Select First
          </span>
        )}
        {selectionStep === 'destination' && label.toLowerCase().includes('destination') && (
          <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800">
            Select Next
          </span>
        )}
      </label>
      <div className="relative flex">
        <div className="relative flex-1">
          <MapPin className={`absolute left-3 top-3 h-4 w-4 ${selectionStep === 'pickup' && label.toLowerCase().includes('pickup') ? 'text-blue-500' : selectionStep === 'destination' && label.toLowerCase().includes('destination') ? 'text-green-500' : 'text-muted-foreground'}`} />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={`pl-10 pr-10 ${selectionStep === 'pickup' && label.toLowerCase().includes('pickup') ? 'border-blue-300 focus:border-blue-500' : selectionStep === 'destination' && label.toLowerCase().includes('destination') ? 'border-green-300 focus:border-green-500' : ''}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          {isLoading && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Popover open={isMapOpen} onOpenChange={setIsMapOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={`ml-2 ${selectionStep === 'pickup' && label.toLowerCase().includes('pickup') ? 'border-blue-300 hover:border-blue-500' : selectionStep === 'destination' && label.toLowerCase().includes('destination') ? 'border-green-300 hover:border-green-500' : ''}`}
            >
              <Map className={`h-4 w-4 ${selectionStep === 'pickup' && label.toLowerCase().includes('pickup') ? 'text-blue-500' : selectionStep === 'destination' && label.toLowerCase().includes('destination') ? 'text-green-500' : ''}`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2">Select on Map</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Click on the map to choose your {label.toLowerCase()} location
              </p>
              <div className="h-60 rounded-md overflow-hidden">
                <MapComponent 
                  center={[6.9271, 79.8612]}
                  zoom={12}
                  className="h-full w-full"
                  selectionMode={true}
                  onSelectLocation={handleMapLocationSelect}
                  selectionStep={selectionStep}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef} 
          className="absolute z-10 mt-1 w-full bg-card shadow-lg rounded-md border border-border max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                onClick={() => handleSelect(suggestion)}
              >
                <div className="flex items-start">
                  <MapPin className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${selectionStep === 'pickup' && label.toLowerCase().includes('pickup') ? 'text-blue-500' : selectionStep === 'destination' && label.toLowerCase().includes('destination') ? 'text-green-500' : 'text-primary'}`} />
                  <span>{suggestion.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
