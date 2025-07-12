// File: components/delivery/buyer/EmptyDeliveryState.tsx
import { Package } from 'lucide-react';

interface EmptyDeliveryStateProps {
  activeTab: string;
}

export const EmptyDeliveryState: React.FC<EmptyDeliveryStateProps> = ({
  activeTab,
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
    </div>
  );
};
