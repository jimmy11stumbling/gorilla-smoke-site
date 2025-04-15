import { Skeleton } from "@/components/ui/skeleton";

export default function MenuItemSkeleton() {
  return (
    <div 
      className="bg-card rounded-lg shadow-md overflow-hidden border border-border"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading menu item"
    >
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/5" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-5/6 mt-2" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}