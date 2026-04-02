import getCurrencyCode from 'country-to-currency';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
};

const conversionRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  JPY: 157,
  AUD: 1.5,
  CAD: 1.37,
  CHF: 0.9,
  CNY: 7.25,
};

const defaultCurrency = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  baseAmounts: [5, 10, 25, 50],
};

export const getCurrencyInfoForCountry = (countryCode) => {
  if (!countryCode) return defaultCurrency;
  
  let currencyCode;
  try {
    currencyCode = getCurrencyCode(countryCode);
  } catch (error) {
    console.error(`Could not get currency for country code: ${countryCode}`, error);
    currencyCode = 'USD';
  }

  if (!currencyCode || !conversionRates[currencyCode]) {
    currencyCode = 'USD';
  }
  
  const symbol = currencySymbols[currencyCode] || '$';
  const rate = conversionRates[currencyCode] / conversionRates['USD'];

  const baseAmounts = defaultCurrency.baseAmounts.map(amount => Math.round(amount * rate));

  return {
    code: currencyCode,
    symbol: symbol,
    baseAmounts: baseAmounts,
  };
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount === null || amount === undefined) {
    return `${currencySymbols[currencyCode] || '$'}0.00`;
  }

  const symbol = currencySymbols[currencyCode] || '$';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `${symbol}0.00`;
  }

  return `${symbol}${numAmount.toFixed(2)}`;
};