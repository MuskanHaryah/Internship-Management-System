// Form Validation Utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.length > 50) {
    return 'Name must not exceed 50 characters';
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateDate = (date, fieldName) => {
  if (!date) {
    return `${fieldName} is required`;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  return null;
};

export const validateFutureDate = (date, fieldName) => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return `${fieldName} must be in the future`;
  }
  return null;
};

export const validateUrl = (url, fieldName) => {
  if (!url) return null; // URL is optional
  
  const urlRegex = /^https?:\/\/.+/;
  if (!urlRegex.test(url)) {
    return `${fieldName} must be a valid URL (starting with http:// or https://)`;
  }
  return null;
};

export const validateRating = (rating) => {
  if (!rating) {
    return 'Rating is required';
  }
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

export const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  if (!priority) {
    return 'Priority is required';
  }
  if (!validPriorities.includes(priority.toLowerCase())) {
    return 'Priority must be low, medium, or high';
  }
  return null;
};

export const validateStatus = (status, validStatuses) => {
  if (!status) {
    return 'Status is required';
  }
  if (!validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }
  return null;
};

// Validate file upload
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    fieldName = 'File'
  } = options;

  if (!file) {
    return `${fieldName} is required`;
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `${fieldName} size must not exceed ${maxSizeMB}MB`;
  }

  if (!allowedTypes.includes(file.type)) {
    return `${fieldName} must be one of: ${allowedTypes.join(', ')}`;
  }

  return null;
};

// Validate multiple fields at once
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required) {
      const error = validateRequired(value, rule.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }
    
    if (rule.email && value) {
      const error = validateEmail(value);
      if (error) errors[field] = error;
    }
    
    if (rule.minLength && value) {
      const error = validateMinLength(value, rule.minLength, rule.label || field);
      if (error) errors[field] = error;
    }
    
    if (rule.maxLength && value) {
      const error = validateMaxLength(value, rule.maxLength, rule.label || field);
      if (error) errors[field] = error;
    }
    
    if (rule.custom && value) {
      const error = rule.custom(value);
      if (error) errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateDate,
  validateFutureDate,
  validateUrl,
  validateRating,
  validatePriority,
  validateStatus,
  validateFile,
  validateForm,
};
