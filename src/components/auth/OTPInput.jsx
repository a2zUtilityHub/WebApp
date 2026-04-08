import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const OTPInput = ({ value = "", onChange, maxLength = 6 }) => {
  const inputRefs = useRef([]);

  // Initialize array of refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, maxLength);
  }, [maxLength]);

  const handleChange = (e, index) => {
    const newValue = e.target.value;
    
    // Handle non-numeric input
    if (isNaN(newValue)) return;

    const newOtp = value.split('');
    newOtp[index] = newValue.substring(newValue.length - 1);
    const combinedOtp = newOtp.join('');
    
    onChange(combinedOtp);

    // Auto-focus next
    if (newValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
        if (!value[index] && index > 0) {
            // If empty, move back and delete previous
            const newOtp = value.split('');
            newOtp[index - 1] = '';
            onChange(newOtp.join(''));
            inputRefs.current[index - 1]?.focus();
        } else {
            // Just delete current
            const newOtp = value.split('');
            newOtp[index] = '';
            onChange(newOtp.join(''));
        }
    } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, maxLength);
    if (!/^\d+$/.test(pastedData)) return; // Only numbers

    onChange(pastedData);
    
    // Focus last filled
    const nextIndex = Math.min(pastedData.length, maxLength - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: maxLength }).map((_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className={cn(
            "w-10 h-12 text-center text-lg font-bold transition-all",
            value[index] ? "border-primary ring-1 ring-primary/20" : "border-input",
            "focus:scale-105 focus:z-10"
          )}
        />
      ))}
    </div>
  );
};

export default OTPInput;