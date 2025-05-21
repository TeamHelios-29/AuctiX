// File: components/delivery/buyer/BuyerDeliveryStats.tsx
import { Box, Package, ShoppingBag, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Delivery } from '@/services/deliveryService';

interface BuyerDeliveryStatsProps {
  deliveries: Delivery[];
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BuyerDeliveryStats: React.FC<BuyerDeliveryStatsProps> = ({
  deliveries,
  isLoading,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card
        className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          activeTab === 'all' ? 'border-2 border-amber-300' : ''
        }`}
        onClick={() => setActiveTab('all')}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-full">
            <Box className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <div className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-8" /> : deliveries.length}
            </div>
            <div className="text-sm text-gray-500">All Deliveries</div>
          </div>
        </div>
      </Card>
      <Card
        className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          activeTab === 'packing' ? 'border-2 border-amber-300' : ''
        }`}
        onClick={() => setActiveTab('packing')}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-full">
            <Package className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600">
              {isLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                deliveries.filter((d) => d.status.toLowerCase() === 'packing')
                  .length
              )}
            </div>
            <div className="text-sm text-gray-500">Packing</div>
          </div>
        </div>
      </Card>
      <Card
        className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          activeTab === 'shipping' ? 'border-2 border-amber-300' : ''
        }`}
        onClick={() => setActiveTab('shipping')}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {isLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                deliveries.filter((d) => d.status.toLowerCase() === 'shipping')
                  .length
              )}
            </div>
            <div className="text-sm text-gray-500">Shipping</div>
          </div>
        </div>
      </Card>
      <Card
        className={`p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          activeTab === 'delivered' ? 'border-2 border-amber-300' : ''
        }`}
        onClick={() => setActiveTab('delivered')}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              {isLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                deliveries.filter((d) => d.status.toLowerCase() === 'delivered')
                  .length
              )}
            </div>
            <div className="text-sm text-gray-500">Delivered</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
