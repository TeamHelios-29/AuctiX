// File: components/delivery/shared/ItemHelper.tsx
import { BookOpen, Box, ShoppingBag } from 'lucide-react';

export const getItemIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'furniture':
      return <ShoppingBag size={30} className="text-amber-700" />;
    case 'collectibles':
      return <BookOpen size={30} className="text-blue-700" />;
    case 'electronics':
      return <Box size={30} className="text-gray-700" />;
    case 'home decor':
      return <Box size={30} className="text-green-700" />;
    default:
      return <Box size={30} className="text-gray-700" />;
  }
};
