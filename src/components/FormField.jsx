import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  helperText,
  maxLength,
  className,
  placeholder,
  ...props
}) => {
  const isError = touched && error;
  const isSuccess = touched && !error && value && value.toString().trim() !== '';

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && (
        <Label htmlFor={name} className="flex items-center text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <InputComponent
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          placeholder={placeholder}
          className={cn(
            "w-full transition-all duration-200",
            isError && "border-red-500 focus-visible:ring-red-500",
            isSuccess && "border-green-500 focus-visible:ring-green-500",
            type === 'textarea' && "min-h-[100px]"
          )}
          {...props}
        />
        
        <AnimatePresence>
          {isSuccess && type !== 'textarea' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            >
              <CheckCircle2 className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-start min-h-[20px]">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center text-sm text-red-500"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {error}
              </motion.div>
            ) : helperText ? (
              <motion.p
                key="helper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                {helperText}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
        
        {maxLength && (
          <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
            {value?.length || 0} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField;