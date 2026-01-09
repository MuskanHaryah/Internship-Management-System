// Error Handling Utilities

// Format API error messages
export const formatErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  // Network errors
  if (!error.response) {
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection';
    }
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please try again later';
    }
    return error.message || 'Network error occurred';
  }
  
  // Server errors with response
  const { status, data } = error.response;
  
  // Handle specific status codes
  switch (status) {
    case 400:
      return data?.message || 'Invalid request. Please check your input';
    case 401:
      return 'Session expired. Please login again';
    case 403:
      return 'You do not have permission to perform this action';
    case 404:
      return data?.message || 'Requested resource not found';
    case 409:
      return data?.message || 'Conflict: Resource already exists';
    case 422:
      return data?.message || 'Validation error. Please check your input';
    case 429:
      return 'Too many requests. Please try again later';
    case 500:
      return 'Server error. Please try again later';
    case 502:
      return 'Bad gateway. Server is temporarily unavailable';
    case 503:
      return 'Service unavailable. Please try again later';
    default:
      return data?.message || `Error ${status}: Something went wrong`;
  }
};

// Extract validation errors from API response
export const extractValidationErrors = (error) => {
  if (!error.response?.data) return {};
  
  const { data } = error.response;
  
  // Handle different error formats
  if (data.errors && typeof data.errors === 'object') {
    return data.errors;
  }
  
  if (data.validationErrors) {
    return data.validationErrors;
  }
  
  return {};
};

// Check if error is authentication error
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

// Check if error is permission error
export const isPermissionError = (error) => {
  return error?.response?.status === 403;
};

// Check if error is network error
export const isNetworkError = (error) => {
  return !error.response || error.code === 'ERR_NETWORK';
};

// Retry function for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth/permission errors
      if (isAuthError(error) || isPermissionError(error)) {
        throw error;
      }
      
      // Don't retry on 4xx errors (except 429)
      if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// Log errors for debugging
export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.group(`Error${context ? ` in ${context}` : ''}`);
    console.error('Error:', error);
    console.error('Response:', error.response);
    console.error('Message:', formatErrorMessage(error));
    console.groupEnd();
  }
};

// Handle form submission errors
export const handleFormError = (error, setError) => {
  const validationErrors = extractValidationErrors(error);
  
  // Set field-specific errors
  Object.keys(validationErrors).forEach(field => {
    setError(field, {
      type: 'server',
      message: validationErrors[field]
    });
  });
  
  // Return general error message
  return formatErrorMessage(error);
};

export default {
  formatErrorMessage,
  extractValidationErrors,
  isAuthError,
  isPermissionError,
  isNetworkError,
  retryRequest,
  logError,
  handleFormError,
};
