
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { getLocationSuggestions } from '@/utils/mapUtils';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
  placeholder: string;
  label: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder,
  label
}) => {
  const [suggestions, setSuggestions] = useState<Array<{id: string, name: string, lat: number, lng: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  return (
    <div className="relative">
      <label className="text-sm font-medium block mb-1">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="pl-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef} 
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelect(suggestion)}
              >
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-gray-500" />
                  <span className="text-gray-800">{suggestion.name}</span>
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
