
import React from 'react';
import { MapPin, Navigation2 } from 'lucide-react';

interface MapSelectionHelperProps {
  selectionStep: 'pickup' | 'destination';
}

const MapSelectionHelper: React.FC<MapSelectionHelperProps> = ({
  selectionStep
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-md shadow-md text-xs z-[1000] text-gray-800 flex flex-col gap-2 max-w-[200px]">
      {selectionStep === 'pickup' ? (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-500" />
          <p>Click on the map to set your pickup point</p>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Navigation2 className="h-4 w-4 text-green-500" />
          <p>Click on the map to set your destination</p>
        </div>
      )}
    </div>
  );
};

export default MapSelectionHelper;
