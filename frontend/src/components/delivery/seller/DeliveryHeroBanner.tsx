// File: components/delivery/seller/DeliveryHeroBanner.tsx
import { Truck } from 'lucide-react';

export const DeliveryHeroBanner: React.FC = () => {
  return (
    <div className="bg-[linear-gradient(to_right_bottom,#fbbf24,#fef3c7)] mb-8 py-8 px-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Manage Your Deliveries
          </h2>
          <p className="text-gray-700 max-w-md">
            Track and manage deliveries for your auction items. Keep your buyers
            updated with accurate delivery information.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Truck size={64} className="text-gray-800" />
        </div>
      </div>
    </div>
  );
};
