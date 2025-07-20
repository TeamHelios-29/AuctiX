// File: components/delivery/shared/StatusHelper.tsx
import { Check, Package, Truck } from 'lucide-react';

export const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'shipping':
      return {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        bgColor: 'bg-blue-50',
        buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
        icon: <Truck className="w-4 h-4 mr-1" />,
        text: 'Shipping',
      };
    case 'packing':
      return {
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        bgColor: 'bg-amber-50',
        buttonColor: 'bg-amber-400 hover:bg-amber-500 text-gray-900',
        icon: <Package className="w-4 h-4 mr-1" />,
        text: 'Packing',
      };
    case 'delivered':
      return {
        color: 'text-green-600 bg-green-50 border-green-200',
        bgColor: 'bg-green-50',
        buttonColor: 'bg-green-500 hover:bg-green-600 text-white',
        icon: <Check className="w-4 h-4 mr-1" />,
        text: 'Delivered',
      };
    default:
      return {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        bgColor: 'bg-gray-50',
        buttonColor: 'bg-gray-500 hover:bg-gray-600 text-white',
        icon: <Package className="w-4 h-4 mr-1" />,
        text: status,
      };
  }
};
