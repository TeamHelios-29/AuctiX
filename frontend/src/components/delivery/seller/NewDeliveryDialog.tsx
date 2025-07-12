// 3. Fix NewDeliveryDialog.tsx - Fix interface consistency
// File: components/delivery/seller/NewDeliveryDialog.tsx
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
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
import { isValidDate, isPastDate } from '../shared/DateHelper';

// Updated to match the interface in SellerDeliveryPage.tsx
interface NewDeliveryData {
  auctionId: string;
  buyerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  notes?: string;
  trackingNumber?: string;
}

interface NewDeliveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewDeliveryData) => void;
  isLoading: boolean;
}

export const NewDeliveryDialog: React.FC<NewDeliveryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<NewDeliveryData>({
    auctionId: '',
    buyerId: '',
    deliveryDate: '',
    deliveryAddress: '',
    notes: '',
    trackingNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.auctionId.trim()) {
      newErrors.auctionId = 'Auction ID is required';
    }
    if (!formData.buyerId.trim()) {
      newErrors.buyerId = 'Buyer ID is required';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else if (!isValidDate(formData.deliveryDate)) {
      newErrors.deliveryDate = 'Please enter a valid date';
    } else if (isPastDate(formData.deliveryDate)) {
      newErrors.deliveryDate = 'Date cannot be in the past';
    }
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Delivery</DialogTitle>
          <DialogDescription>
            Enter the delivery details for your auction item.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auction ID*
              </label>
              <Input
                name="auctionId"
                value={formData.auctionId}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter auction ID"
              />
              {errors.auctionId && (
                <p className="mt-1 text-sm text-red-500">{errors.auctionId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer ID*
              </label>
              <Input
                name="buyerId"
                value={formData.buyerId}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter buyer ID"
              />
              {errors.buyerId && (
                <p className="mt-1 text-sm text-red-500">{errors.buyerId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date*
              </label>
              <Input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="w-full"
              />
              {errors.deliveryDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.deliveryDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address*
              </label>
              <Input
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter delivery address"
              />
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.deliveryAddress}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number (Optional)
              </label>
              <Input
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter tracking number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
                placeholder="Enter any additional notes"
              ></textarea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-amber-300 hover:bg-amber-400 text-gray-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Delivery'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
