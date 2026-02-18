export const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );
};

export const SkeletonList = ({ count = 6 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </>
    );
};
