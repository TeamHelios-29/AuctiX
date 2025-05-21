// File: src/components/delivery/seller/DatePickerDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { isValidDate, isPastDate } from '../shared/DateHelper';

interface DatePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newDate: string;
  setNewDate: (date: string) => void;
  handleUpdateDeliveryDate: (id: string, date: string) => void;
  selectedDeliveryId: string | null;
  isLoading: boolean;
}

export const DatePickerDialog: React.FC<DatePickerDialogProps> = ({
  isOpen,
  onClose,
  newDate,
  setNewDate,
  handleUpdateDeliveryDate,
  selectedDeliveryId,
  isLoading,
}) => {
  const isPast = newDate ? isPastDate(newDate) : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Delivery Date</DialogTitle>
          <DialogDescription>
            Choose a new delivery date for this order.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Delivery Date
          </label>
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full"
          />
          {newDate && !isValidDate(newDate) && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              Please enter a valid date format (YYYY-MM-DD)
            </p>
          )}
          {newDate && isValidDate(newDate) && isPast && (
            <p className="mt-1 text-sm text-amber-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              You are selecting a date in the past
            </p>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              selectedDeliveryId &&
              handleUpdateDeliveryDate(selectedDeliveryId, newDate)
            }
            disabled={!newDate || !isValidDate(newDate) || isLoading}
            className={`bg-amber-300 hover:bg-amber-400 text-gray-900 ${
              !newDate || !isValidDate(newDate) || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Date'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
