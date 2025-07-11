// File: src/components/delivery/seller/Pagination.tsx
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  currentItemsCount: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  isLoading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  currentItemsCount,
  goToPreviousPage,
  goToNextPage,
  isLoading,
}) => {
  // Calculate the range being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + currentItemsCount - 1, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      {totalItems > 0 ? (
        <p className="text-sm text-gray-500">
          Showing {startItem}-{endItem} of {totalItems} deliveries
        </p>
      ) : (
        <p className="text-sm text-gray-500">No deliveries to display</p>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || isLoading || totalItems === 0}
          className="border-amber-300 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
          aria-label="Go to previous page"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {totalPages > 0 && (
          <span className="flex items-center px-3 text-sm">
            Page {currentPage} of {totalPages}
          </span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
          className="border-amber-300 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
          aria-label="Go to next page"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
