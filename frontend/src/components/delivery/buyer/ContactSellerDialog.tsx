// File: components/delivery/buyer/ContactSellerDialog.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Delivery } from '@/services/deliveryService';

interface ContactSellerDialogProps {
  selectedDelivery: Delivery | null;
  isContactSellerModalOpen: boolean;
  setIsContactSellerModalOpen: (open: boolean) => void;
  contactMessage: string;
  setContactMessage: (message: string) => void;
  sendContactMessage: () => void;
}

export const ContactSellerDialog: React.FC<ContactSellerDialogProps> = ({
  selectedDelivery,
  isContactSellerModalOpen,
  setIsContactSellerModalOpen,
  contactMessage,
  setContactMessage,
  sendContactMessage,
}) => {
  if (!selectedDelivery) return null;

  return (
    <Dialog
      open={isContactSellerModalOpen}
      onOpenChange={setIsContactSellerModalOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to {selectedDelivery.sellerName} about your delivery
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Regarding
            </h4>
            <p className="text-sm">
              Delivery for: <strong>{selectedDelivery.auctionTitle}</strong>
            </p>
            <p className="text-sm mt-1">
              Status: <strong>{selectedDelivery.status}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsContactSellerModalOpen(false)}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={sendContactMessage}
            disabled={contactMessage.trim() === ''}
            className="bg-amber-300 hover:bg-amber-400 text-gray-900"
          >
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
