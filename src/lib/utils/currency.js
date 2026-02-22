/**
 * Currency utility functions
 */

/**
 * Convert amount to different currency (basic conversion)
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {number} exchangeRate - Exchange rate (fromCurrency to toCurrency)
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency, exchangeRate) {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
}

/**
 * Format amount based on locale
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrencyByLocale(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string (e.g., "$1,234.56")
 * @returns {number} Parsed number
 */
export function parseCurrency(currencyString) {
  if (!currencyString) return 0;
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Calculate percentage change
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Calculate profit margin
 * @param {number} revenue - Revenue amount
 * @param {number} cost - Cost amount
 * @returns {number} Profit margin percentage
 */
export function calculateProfitMargin(revenue, cost) {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}


