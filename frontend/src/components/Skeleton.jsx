const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-600/30 to-transparent"></div>
      <div className="flex items-center gap-4 mb-4 relative">
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-3 relative">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
      </div>
    </div>
  );
};

const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1 animate-pulse"
              style={{ animationDelay: `${col * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            <div className="flex gap-4 items-center">
              <div 
                className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"
                style={{ animationDelay: `${idx * 0.1}s` }}
              ></div>
              {[1, 2, 3].map((col) => (
                <div
                  key={col}
                  className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1 animate-pulse"
                  style={{ animationDelay: `${(idx * 0.1) + (col * 0.05)}s` }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkeletonText = ({ lines = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className={`h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ${
            idx === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        ></div>
      ))}
    </div>
  );
};

const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 overflow-hidden relative"
          style={{ animationDelay: `${item * 0.1}s` }}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-600/30 to-transparent"></div>
          <div className="flex justify-between items-start mb-4 relative">
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonTable, SkeletonText, SkeletonStats };
