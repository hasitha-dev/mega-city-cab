
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit, Trash2, X } from 'lucide-react';

interface EditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: (data: any) => void;
  item: any;
}

const EditPopup: React.FC<EditPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  item
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.pickupLocation || !formData.destination) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(item);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-primary" />
            Edit Booking
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 hover:bg-secondary/50" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="pickupLocation">Pickup Location</Label>
            <Input 
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation || ''}
              onChange={handleChange}
              className="bg-secondary/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input 
              id="destination"
              name="destination"
              value={formData.destination || ''}
              onChange={handleChange}
              className="bg-secondary/50"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate">Pickup Date</Label>
              <Input 
                id="pickupDate"
                name="pickupDate"
                type="date"
                value={formData.pickupDate || ''}
                onChange={handleChange}
                className="bg-secondary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input 
                id="pickupTime"
                name="pickupTime"
                type="time"
                value={formData.pickupTime || ''}
                onChange={handleChange}
                className="bg-secondary/50"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center space-x-2 pt-4">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPopup;
