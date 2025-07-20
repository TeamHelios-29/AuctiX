// File: components/delivery/shared/DeliverySkeletons.tsx
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DeliverySkeletonsProps {
  count?: number;
}

export const DeliverySkeletons: React.FC<DeliverySkeletonsProps> = ({
  count = 3,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex gap-4 flex-grow">
              <Skeleton className="w-20 h-20 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <Skeleton className="h-14 w-24" />
              <Skeleton className="h-14 w-24" />
              <Skeleton className="h-10 w-28 self-center" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-36 ml-auto" />
          </div>
        </Card>
      ))}
    </div>
  );
};
