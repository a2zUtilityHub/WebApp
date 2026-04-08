import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = useMemo(() => [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /[0-9]/, text: "One number" },
    { regex: /[^A-Za-z0-9]/, text: "One special character" },
  ], []);

  const strength = useMemo(() => {
    if (!password) return 0;
    return requirements.reduce((acc, req) => (req.regex.test(password) ? acc + 1 : acc), 0);
  }, [password, requirements]);

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-muted";
    if (score <= 2) return "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    if (score <= 4) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  };

  const getStrengthLabel = (score) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak";
    if (score <= 4) return "Fair";
    return "Strong";
  };

  return (
    <div className="w-full space-y-4 mt-2 mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13px] font-semibold text-muted-foreground">Password Strength</span>
        <span className={`text-[13px] font-bold transition-colors duration-300 ${
          strength === 0 ? 'text-muted-foreground' : 
          strength <= 2 ? 'text-destructive' : 
          strength <= 4 ? 'text-amber-500' : 'text-emerald-500'
        }`}>
          {getStrengthLabel(strength)}
        </span>
      </div>
      
      {/* Animated Pill Bars */}
      <div className="flex gap-2 h-1.5 w-full">
        {[1, 2, 3, 4, 5].map((index) => (
          <div 
            key={index} 
            className={`flex-1 rounded-full transition-all duration-500 ease-out ${
              strength >= index ? getStrengthColor(strength) : "bg-muted/50"
            }`} 
          />
        ))}
      </div>

      {/* Requirement Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        {requirements.map((req, index) => {
          const isMet = req.regex.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-[13px]">
              {isMet ? (
                <div className="bg-emerald-500/10 text-emerald-500 rounded-full p-0.5 border border-emerald-500/20 shadow-sm transition-all duration-300 scale-100">
                  <Check className="w-3 h-3" />
                </div>
              ) : (
                <div className="bg-muted/50 text-muted-foreground/50 rounded-full p-0.5 border border-border/50 transition-all duration-300 scale-95">
                  <X className="w-3 h-3" />
                </div>
              )}
              <span className={`transition-colors duration-300 font-medium ${isMet ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;