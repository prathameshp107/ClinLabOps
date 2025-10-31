import { Skeleton } from "@/components/ui/skeleton";

export default function LoginSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-12 w-full" />
            </div>

            <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>

            <Skeleton className="h-12 w-full" />
        </div>
    );
}