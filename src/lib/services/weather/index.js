/**
 * Weather service
 * Integrates with weather API to fetch current and forecast data
 */

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Current weather data
 */
export async function getCurrentWeather(lat, lon) {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key not configured');
  }

  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      windSpeed: data.wind?.speed || 0,
      visibility: data.visibility || 0,
      location: data.name,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

/**
 * Get weather forecast for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Number of days to forecast (default: 5)
 * @returns {Promise<Array>} Forecast data
 */
export async function getWeatherForecast(lat, lon, days = 5) {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key not configured');
  }

  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&cnt=${days * 8}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    return data.list.map((item) => ({
      date: new Date(item.dt * 1000),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      windSpeed: item.wind?.speed || 0,
      precipitation: item.rain?.['3h'] || 0,
    }));
  } catch (error) {
    console.error('Weather forecast API error:', error);
    throw error;
  }
}

