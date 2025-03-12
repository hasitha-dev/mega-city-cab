
import React, { useState, useEffect } from 'react';

interface LocationSuggestionsProps {
  input: string;
}

const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  input
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

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
    );
  };

  useEffect(() => {
    setSuggestions(getLocationSuggestions(input));
  }, [input]);

  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="suggestion-item">
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default LocationSuggestions;
