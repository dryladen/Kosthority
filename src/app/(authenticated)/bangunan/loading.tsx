import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Search and filters skeleton */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Table skeleton */}
            <div className="space-y-4">
                <div className="border rounded-lg">
                    {/* Table header */}
                    <div className="flex items-center h-12 px-4 border-b">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-24 mx-2" />
                        ))}
                    </div>

                    {/* Table rows */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center h-12 px-4 border-b last:border-b-0">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Skeleton key={j} className="h-4 w-20 mx-2" />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Pagination skeleton */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}
