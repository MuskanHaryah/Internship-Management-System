import Spinner from './Spinner';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Spinner size="xl" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
