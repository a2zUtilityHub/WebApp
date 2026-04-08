import React, { useRef, useState, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only one character per box
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Check if complete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    // Auto-focus previous input on Backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length).replace(/\D/g, '');
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty box, or the last box
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex].focus();
    
    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-4 w-full max-w-sm mx-auto my-8">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={length}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 sm:w-14 sm:h-16 bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl text-center text-2xl font-black text-foreground focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all shadow-inner placeholder:text-muted-foreground/30 hover:border-primary/50"
        />
      ))}
    </div>
  );
};

export default OTPInput;