import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AuctionReportProps = {
  itemId: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (itemId: string, complaint: string) => void;
};

const AuctionReport: React.FC<AuctionReportProps> = ({
  itemId,
  open,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState('');
  const [complaint, setComplaint] = useState('');
  const reasons = [
    'Item not as described',
    'Inappropriate or misleading title',
    'Damaged item',
    'Poor quality images',
    'Fake item or AI-generated image',
    'Prohibited or illegal item',
    'Copyright-infringing content',
    'Scam or fraudulent listing',
    'Offensive or harmful content',
    'Incorrect or deceptive product category',
    'Duplicate or spam listing',
    'Suspicious seller activity',
    'Other',
  ];

  const isOther = reason === 'Other';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Auction Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Reason:
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <Textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder={
              isOther
                ? 'Please describe your complaint...'
                : 'Additional details (optional)'
            }
            rows={5}
            className="w-full"
            disabled={!isOther && reason !== ''}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSubmit(itemId, isOther ? complaint : reason);
                setComplaint('');
                setReason('');
                onClose();
              }}
              disabled={!reason || (isOther && !complaint.trim())}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionReport;
