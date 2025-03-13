
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import ConfirmationDialog from '@/components/ConfirmationDialog';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    onDelete(item);
    onClose();
    setIsDeleteDialogOpen(false);
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border border-border">
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
                className="bg-background"
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
                className="bg-background"
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
                  className="bg-background"
                  min={new Date().toISOString().split('T')[0]}
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
                  className="bg-background"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType || ''}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border bg-background rounded-md"
                >
                  <option value="">Select Vehicle</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Input 
                  id="passengers"
                  name="passengers"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.passengers || '1'}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center space-x-2 pt-4">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
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

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};

export default EditPopup;
