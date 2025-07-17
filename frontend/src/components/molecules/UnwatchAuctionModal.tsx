import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UnwatchAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  auctionTitle: string;
}

export default function UnwatchAuctionModal({
  isOpen,
  onClose,
  onConfirm,
  auctionTitle,
}: UnwatchAuctionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg font-semibold">Unwatch Auction</h2>
        </DialogHeader>
        <div className="py-4">
          Are you sure you want to unwatch <strong>{auctionTitle}</strong>?
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Unwatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
