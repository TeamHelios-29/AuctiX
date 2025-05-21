// File: src/components/delivery/seller/ErrorDisplay.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string | null;
  handleRefresh: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  handleRefresh,
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="text-red-500 mr-2" />
        <h3 className="text-red-800 font-medium">Error loading deliveries</h3>
      </div>
      <p className="text-red-700 mt-1">{error}</p>
      <Button
        onClick={handleRefresh}
        className="mt-2 bg-red-100 text-red-800 hover:bg-red-200"
        size="sm"
      >
        <RefreshCw className="w-4 h-4 mr-1" /> Try Again
      </Button>
    </div>
  );
};
