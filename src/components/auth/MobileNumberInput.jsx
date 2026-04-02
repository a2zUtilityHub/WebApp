import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import { Check, X } from 'lucide-react';
import countries from '@/lib/countries.json'; // Ensure this file exists or use a smaller list

// Fallback if countries json is missing or large
const defaultCountries = [
    { code: 'US', name: 'United States', dial_code: '+1' },
    { code: 'GB', name: 'United Kingdom', dial_code: '+44' },
    { code: 'IN', name: 'India', dial_code: '+91' },
    { code: 'CA', name: 'Canada', dial_code: '+1' },
    { code: 'AU', name: 'Australia', dial_code: '+61' },
    // ... add more common ones
];

const MobileNumberInput = ({ value, onChange, onValidityChange }) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [localNumber, setLocalNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleCountryChange = (val) => {
    setCountryCode(val);
    validate(val, localNumber);
  };

  const handleNumberChange = (e) => {
    // Basic filtering
    const val = e.target.value.replace(/[^0-9\s-]/g, '');
    setLocalNumber(val);
    validate(countryCode, val);
  };

  const validate = (code, number) => {
    const fullNumber = `${code}${number}`;
    // Using simple validation for now if libphonenumber fails or is heavy
    // But since task required libphonenumber-js:
    try {
        const valid = isValidPhoneNumber(fullNumber);
        setIsValid(valid);
        onValidityChange(valid);
        if(valid) {
            onChange(fullNumber);
        } else {
            onChange(null); // Or keep passing raw? Better pass full string
            // onChange(fullNumber); 
        }
    } catch (e) {
        setIsValid(false);
        onValidityChange(false);
    }
  };

  // Construct country list (using provided file or fallback)
  const countryList = countries && countries.length > 0 ? countries : defaultCountries;

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
           {countryList.map((c) => (
               <SelectItem key={`${c.code}-${c.dial_code}`} value={c.dial_code}>
                   <span className="flex items-center gap-2">
                       <span>{c.code}</span>
                       <span className="text-muted-foreground">{c.dial_code}</span>
                   </span>
               </SelectItem>
           ))}
        </SelectContent>
      </Select>
      <div className="relative flex-1">
        <Input 
            value={localNumber}
            onChange={handleNumberChange}
            placeholder="Mobile Number"
            type="tel"
            className={isValid ? "border-green-500 pr-8" : "pr-8"}
        />
        <div className="absolute right-2 top-2.5">
            {localNumber.length > 3 && (
                isValid ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-400" />
            )}
        </div>
      </div>
    </div>
  );
};

export default MobileNumberInput;