// File: src/components/delivery/seller/EmptyDeliveryState.tsx
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDeliveryStateProps {
  activeTab: string;
  setShowNewDeliveryModal: (show: boolean) => void;
}

export const EmptyDeliveryState: React.FC<EmptyDeliveryStateProps> = ({
  activeTab,
  setShowNewDeliveryModal,
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
      <Package size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800">No deliveries found</h3>
      <p className="text-gray-500 mt-2">
        {activeTab === 'all'
          ? "You don't have any deliveries yet."
          : `You don't have any ${activeTab} deliveries.`}
      </p>
      <Button
        className="mt-6 bg-amber-300 hover:bg-amber-400 text-gray-900"
        onClick={() => setShowNewDeliveryModal(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create New Delivery
      </Button>
    </div>
  );
};
