import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocationContext } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';

const CountrySelectorModal = ({ isOpen, onOpenChange }) => {
  const { allCountries, changeCountry, country: currentCountry } = useLocationContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return allCountries;
    return allCountries.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allCountries]);

  const handleCountrySelect = (countryCode) => {
    changeCountry(countryCode);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose your country/region</DialogTitle>
          <DialogDescription>
            This helps us personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-72">
            <div className="space-y-1">
              {filteredCountries.map((country) => (
                <Button
                  key={country.code}
                  variant={currentCountry?.code === country.code ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => handleCountrySelect(country.code)}
                >
                  <img
                    className="h-4 w-6 rounded-sm object-cover"
                    alt={country.name}
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                  />
                  <span>{country.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountrySelectorModal;