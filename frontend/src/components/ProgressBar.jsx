import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, color = 'primary', showLabel = true, animated = true }) => {
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        {animated ? (
          <motion.div
            className={`h-full ${colors[color]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div
            className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
