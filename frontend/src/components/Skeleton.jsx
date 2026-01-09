const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
};

const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4">
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
              {[1, 2, 3].map((col) => (
                <div
                  key={col}
                  className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1 animate-pulse"
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonTable, SkeletonText, SkeletonStats };
