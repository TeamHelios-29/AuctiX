import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect } from 'react';

export function PaginationNav({
  handlePage,
  pages,
  currentPage,
}: {
  handlePage: (page: number) => void;
  pages: number;
  currentPage: number;
}) {
  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handlePage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < pages) {
      handlePage(currentPage + 1);
    }
  };

  useEffect(() => {
    console.log('PaginationNav', {
      handlePage,
      handlePreviousClick,
      handleNextClick,
      pages,
      currentPage,
    });
  }, [handlePage, handlePreviousClick, handleNextClick, pages, currentPage]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousClick}
            className={currentPage < 2 ? 'pointer-events-none opacity-70' : ''}
          />
        </PaginationItem>

        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePage(1)}>1</PaginationLink>
          </PaginationItem>
        )}

        {currentPage > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePage(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink className="bg-gray-500" isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {pages > currentPage && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePage(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage < pages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < pages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePage(pages)}>
              {pages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            className={
              currentPage > pages - 1 ? 'pointer-events-none opacity-70' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
