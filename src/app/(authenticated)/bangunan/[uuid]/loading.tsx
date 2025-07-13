import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Header with back button and title */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-7 rounded" />
                <Skeleton className="h-8 w-48" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
            </div>

            {/* Main content card */}
            <div className="grid gap-4">
                <div className="border rounded-lg p-6">
                    {/* Card header */}
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    {/* Card content */}
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-full max-w-sm" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional cards */}
                <div className="grid grid-cols-1 gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-6">
                            <Skeleton className="h-6 w-24 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile action buttons */}
            <div className="flex items-center justify-end gap-2 md:hidden">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    );
}
