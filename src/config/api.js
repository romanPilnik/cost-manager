// api.js - API configuration and constants

// Default exchange rates API endpoint
export const DEFAULT_EXCHANGE_RATES_URL = 'https://currency-rates-api-gdwf.onrender.com/rates.json'

// LocalStorage key for storing the user-configured exchange rates URL
export const EXCHANGE_RATES_STORAGE_KEY = 'exchangeRatesUrl'

// Helper function to get the current exchange rates URL
// Returns user-configured URL from localStorage, or falls back to default
export const getExchangeRatesUrl = () => {
  return localStorage.getItem(EXCHANGE_RATES_STORAGE_KEY) || DEFAULT_EXCHANGE_RATES_URL
}

// Helper function to set a new exchange rates URL
export const setExchangeRatesUrl = (url) => {
  localStorage.setItem(EXCHANGE_RATES_STORAGE_KEY, url)
}