/**
 * @typedef {Object} HarvestPrediction
 * @property {string} _id - Prediction ID
 * @property {string} cropId - Crop ID
 * @property {string} farmerId - Farmer ID
 * @property {number} predictedYield - Predicted yield quantity
 * @property {number} confidence - Confidence score (0-1)
 * @property {Object} factors - Factors affecting prediction
 * @property {string} factors.weather - Weather condition
 * @property {string} factors.soilQuality - Soil quality
 * @property {string} factors.cropType - Crop type
 * @property {Date} createdAt - Creation date
 */

/**
 * @typedef {Object} HarvestEstimate
 * @property {number} estimate - Estimated harvest quantity
 * @property {Object} inputs - Input parameters used for estimation
 * @property {number} inputs.landSize - Land size
 * @property {number} inputs.expectedYieldPerUnit - Expected yield per unit
 * @property {number} inputs.weatherFactor - Weather factor
 */

