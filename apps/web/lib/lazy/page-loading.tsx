import { LoadingSpinner } from '@/components/shared/loading-spinner';

export function PageLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}
