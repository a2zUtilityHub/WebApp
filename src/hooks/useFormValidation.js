import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validationRules, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    if (rules.required && !value) return 'This field is required';
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
    if (rules.minLength && value.length < rules.minLength) return `Minimum length is ${rules.minLength}`;
    if (rules.maxLength && value.length > rules.maxLength) return `Maximum length is ${rules.maxLength}`;
    if (rules.pattern && !rules.pattern.test(value)) return rules.patternMessage || 'Invalid format';
    
    if (rules.custom) {
      const customError = rules.custom(value, values);
      if (customError) return customError;
    }

    return null;
  }, [validationRules, values]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: val }));
    
    if (touched[name]) {
      const error = validateField(name, val);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};