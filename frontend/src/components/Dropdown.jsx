import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, forwardRef } from 'react';

const Dropdown = forwardRef(({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option',
  error,
  className = '',
  name,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    if (onChange) {
      // Support both direct onChange and event-based onChange
      if (typeof onChange === 'function') {
        const syntheticEvent = {
          target: { name, value: option.value }
        };
        onChange(syntheticEvent);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {/* Hidden input for form compatibility */}
      <input
        type="hidden"
        ref={ref}
        name={name}
        value={selectedValue}
        {...props}
      />
      
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 text-left rounded-lg border
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
            }
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            focus:ring-2 focus:outline-none
            transition-all duration-200
            flex items-center justify-between
          `}
        >
          <span className={selectedOption ? '' : 'text-gray-400 dark:text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600
                    transition-colors duration-150
                    ${selectedValue === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
