import { Skeleton } from '@/components/ui/skeleton';

export function VerificationFormSkeleton() {
  return (
    <main className="w-full p-4">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6 mb-8">
              <div className="space-y-3">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="w-16 h-0.5 mx-auto" />
              </div>
              <Skeleton className="h-5 w-64 mx-auto" />
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <div className="w-full">
                <div className="text-center space-y-6">
                  {/* Status Icon */}
                  <div className="rounded-full p-4 inline-flex items-center justify-center bg-muted">
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>

                  {/* Status Text */}
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-56 mx-auto" />
                    <Skeleton className="h-4 w-72 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>

                  {/* Buttons */}
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
