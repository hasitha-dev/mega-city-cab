
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  id: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  id
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  // Sample locations in Colombo for suggestions
  const colomboLocations = [
    "Colombo Fort", "Pettah", "Kollupitiya", "Bambalapitiya", "Wellawatte",
    "Dehiwala", "Mount Lavinia", "Ratmalana", "Moratuwa", "Panadura",
    "Nugegoda", "Maharagama", "Kottawa", "Piliyandala", "Kesbewa",
    "Kaduwela", "Malabe", "Battaramulla", "Rajagiriya", "Borella",
    "Maradana", "Dematagoda", "Kirulapone", "Narahenpita", "Thimbirigasyaya"
  ];

  // Function to get location suggestions
  const getLocationSuggestions = (input: string) => {
    if (!input) return [];
    const normalizedInput = input.toLowerCase();
    return colomboLocations.filter(location => 
      location.toLowerCase().includes(normalizedInput)
    ).slice(0, 5); // Limit to 5 suggestions
  };

  useEffect(() => {
    // Update suggestions when input changes
    setSuggestions(getLocationSuggestions(value));
  }, [value]);

  useEffect(() => {
    // Handle click outside to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={inputRef} className="relative">
      <label htmlFor={id} className="text-sm font-medium mb-1 block">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 py-2 px-3 bg-secondary/50"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="location-suggestions">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
