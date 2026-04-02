import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import allCountries from '@/lib/countries.json';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [country, setCountry] = useLocalStorage('user-country', null);
  const [loading, setLoading] = useState(true);

  const fetchUserCountry = useCallback(async () => {
    if (country) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Failed to fetch geo-location');
      const data = await response.json();
      
      const detectedCountry = allCountries.find(c => c.code === data.country_code);
      if (detectedCountry) {
        setCountry(detectedCountry);
      } else {
        setCountry(allCountries.find(c => c.code === 'IN')); // Fallback to IN
      }
    } catch (error) {
      console.error("Country detection failed:", error);
      setCountry(allCountries.find(c => c.code === 'IN')); // Fallback on error to IN
    } finally {
      setLoading(false);
    }
  }, [country, setCountry]);

  useEffect(() => {
    fetchUserCountry();
  }, [fetchUserCountry]);

  const changeCountry = (countryCode) => {
    const newCountry = allCountries.find(c => c.code === countryCode);
    if (newCountry) {
      setCountry(newCountry);
    }
  };

  const value = {
    country,
    loading,
    changeCountry,
    allCountries,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};