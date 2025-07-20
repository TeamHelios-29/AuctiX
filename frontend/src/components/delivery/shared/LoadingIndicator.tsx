// File: src/components/delivery/shared/LoadingIndicator.tsx
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 bg-white shadow-md rounded-md p-3 flex items-center z-50">
      <Loader2 className="animate-spin mr-2 text-amber-500" size={20} />
      <span>Processing...</span>
    </div>
  );
};
