import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "One uppercase letter" },
    { regex: /[a-z]/, label: "One lowercase letter" },
    { regex: /[0-9]/, label: "One number" },
    { regex: /[^A-Za-z0-9]/, label: "One special character" },
  ];

  const strength = requirements.reduce((acc, req) => {
    return acc + (req.regex.test(password) ? 1 : 0);
  }, 0);

  const getStrengthLabel = () => {
    if (strength === 0) return { text: "", color: "bg-gray-200" };
    if (strength <= 2) return { text: "Weak", color: "bg-red-500" };
    if (strength <= 4) return { text: "Fair", color: "bg-yellow-500" };
    return { text: "Strong", color: "bg-green-500" };
  };

  const strengthInfo = getStrengthLabel();

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password Strength:</span>
          <span className={cn("font-medium", {
            "text-red-500": strength <= 2,
            "text-yellow-500": strength > 2 && strength <= 4,
            "text-green-500": strength === 5
          })}>
            {strengthInfo.text}
          </span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-300", strengthInfo.color)} 
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>

      <ul className="text-xs space-y-1 text-muted-foreground">
        {requirements.map((req, index) => {
          const isMet = req.regex.test(password);
          return (
            <li key={index} className="flex items-center gap-2">
              {isMet ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground/40" />
              )}
              <span className={cn(isMet && "text-foreground")}>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;