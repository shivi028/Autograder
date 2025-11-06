export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long'
    }
  },
  
  fullName: {
    required: 'Full name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters long'
    }
  },
  
  phone: {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    }
  }
}

export const validateField = (value, rules) => {
  if (rules.required && (!value || value.trim() === '')) {
    return rules.required
  }
  
  if (rules.minLength && value && value.length < rules.minLength.value) {
    return rules.minLength.message
  }
  
  if (rules.pattern && value && !rules.pattern.value.test(value)) {
    return rules.pattern.message
  }
  
  return null
}

export const validateForm = (formData, validationSchema) => {
  const errors = {}
  
  Object.keys(validationSchema).forEach(field => {
    const error = validateField(formData[field], validationSchema[field])
    if (error) {
      errors[field] = error
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}