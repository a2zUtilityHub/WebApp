import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteTester = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(`[RouteTester] Visited: ${location.pathname}`);
    // Check if the current path is a 404 or expected
    // This is a simple logger for dev purposes
  }, [location]);

  return null; 
};

export default RouteTester;