// Simple validation functions without external dependencies
const validate = (validators) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, validator] of Object.entries(validators)) {
      const value = req.body[field];
      const result = validator(value, field);
      if (result) {
        errors.push({ field, message: result });
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation error',
        errors,
      });
    }
    
    next();
  };
};

// Validation helper functions
const validators = {
  required: (value, fieldName) => {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  },
  
  minLength: (min) => (value, fieldName) => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },
  
  email: (value, fieldName) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `${fieldName} must be a valid email`;
    }
    return null;
  },
  
  oneOf: (allowedValues) => (value, fieldName) => {
    if (value && !allowedValues.includes(value)) {
      return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
    }
    return null;
  },
};

module.exports = { validate, validators };
