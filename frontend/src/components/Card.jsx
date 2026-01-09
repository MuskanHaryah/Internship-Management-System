const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  hover = false,
  padding = 'normal',
  ...props 
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${hover ? 'hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-0.5' : ''} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
