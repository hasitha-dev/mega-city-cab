
import React, { useRef, useEffect } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

interface ActionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  position: { x: number; y: number };
  isReadOnly?: boolean;
}

const ActionPopup: React.FC<ActionPopupProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onView,
  position,
  isReadOnly = false
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Adjust position to prevent popup from going off screen
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 160),
    y: Math.min(position.y, window.innerHeight - 150)
  };

  return (
    <div
      ref={popupRef}
      className="action-popup fixed z-50 rounded-md shadow-lg py-1 min-w-40 bg-gray-800 border border-gray-700"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
    >
      <div className="flex flex-col">
        <button
          className="action-item flex items-center px-4 py-2 text-sm text-white hover:bg-white/10"
          onClick={onView}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </button>
        
        {!isReadOnly && (
          <>
            <button
              className="action-item flex items-center px-4 py-2 text-sm text-white hover:bg-white/10"
              onClick={onEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
            
            <button
              className="action-item flex items-center px-4 py-2 text-sm text-white hover:bg-white/10"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionPopup;
