/**
 * Calculation utility functions
 */

/**
 * Calculate harvest estimation based on inputs
 * @param {Object} params - Calculation parameters
 * @param {number} params.landSize - Land size in acres/hectares
 * @param {string} params.cropType - Type of crop
 * @param {number} params.expectedYieldPerUnit - Expected yield per unit
 * @param {number} params.weatherFactor - Weather impact factor (0-1)
 * @returns {number} Estimated harvest quantity
 */
export function calculateHarvestEstimate({ landSize, cropType, expectedYieldPerUnit, weatherFactor = 1 }) {
  if (!landSize || !expectedYieldPerUnit) return 0;
  return Math.round(landSize * expectedYieldPerUnit * weatherFactor);
}

/**
 * Calculate total expenses
 * @param {Array<Object>} expenses - Array of expense objects with amount property
 * @returns {number} Total expenses
 */
export function calculateTotalExpenses(expenses) {
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
}

/**
 * Calculate profit
 * @param {number} revenue - Total revenue
 * @param {number} expenses - Total expenses
 * @returns {number} Profit amount
 */
export function calculateProfit(revenue, expenses) {
  return revenue - expenses;
}

/**
 * Calculate profit percentage
 * @param {number} revenue - Total revenue
 * @param {number} expenses - Total expenses
 * @returns {number} Profit percentage
 */
export function calculateProfitPercentage(revenue, expenses) {
  if (revenue === 0) return 0;
  return ((revenue - expenses) / revenue) * 100;
}

/**
 * Calculate average value
 * @param {Array<number>} values - Array of numbers
 * @returns {number} Average value
 */
export function calculateAverage(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + (Number(val) || 0), 0);
  return sum / values.length;
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export function calculatePercentage(part, total) {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Round to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export function roundToDecimals(value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}


