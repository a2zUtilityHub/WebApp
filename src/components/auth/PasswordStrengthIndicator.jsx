import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  // Calculate strength criteria
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains a special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: "Contains uppercase & lowercase", met: /(?=.*[a-z])(?=.*[A-Z])/.test(password) }
  ];

  const metCount = criteria.filter(c => c.met).length;
  
  // Determine color and label based on score
  const getStrengthData = () => {
    if (password.length === 0) return { color: 'bg-muted/50', label: 'Enter a password', width: '0%' };
    if (metCount <= 1) return { color: 'bg-red-500', label: 'Weak', width: '25%' };
    if (metCount === 2) return { color: 'bg-orange-500', label: 'Fair', width: '50%' };
    if (metCount === 3) return { color: 'bg-amber-500', label: 'Good', width: '75%' };
    return { color: 'bg-emerald-500', label: 'Strong', width: '100%' };
  };

  const strength = getStrengthData();

  return (
    <div className="w-full space-y-3 mt-3">
      {/* Strength Bar */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-muted-foreground">Password strength</span>
        <span className={`text-[13px] font-bold ${strength.color.replace('bg-', 'text-')}`}>
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden flex">
        <motion.div 
          className={`h-full rounded-full ${strength.color}`}
          initial={{ width: 0 }}
          animate={{ width: strength.width }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        {criteria.map((criterion, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[13px]">
            <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-300 ${criterion.met ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted/50 text-muted-foreground/50'}`}>
              {criterion.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <span className={`transition-colors duration-300 ${criterion.met ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;