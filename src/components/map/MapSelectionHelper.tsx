
import React from 'react';
import { MapPin, Navigation2, Info } from 'lucide-react';

interface MapSelectionHelperProps {
  selectionStep: 'pickup' | 'destination';
  showInvoiceDetails?: () => void;
  hasRoute?: boolean;
}

const MapSelectionHelper: React.FC<MapSelectionHelperProps> = ({
  selectionStep,
  showInvoiceDetails,
  hasRoute = false
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
      
      {hasRoute && showInvoiceDetails && (
        <button
          onClick={showInvoiceDetails}
          className="flex items-center space-x-2 text-xs mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Info className="h-3 w-3" />
          <span>View Fare Details</span>
        </button>
      )}
    </div>
  );
};

export default MapSelectionHelper;
