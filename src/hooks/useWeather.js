'use client';

import { useState } from 'react';
import { get } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const data = await get(`${API_ENDPOINTS.WEATHER.CURRENT}?lat=${lat}&lon=${lon}`);
      setWeather(data.weather);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (lat, lon, days = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await get(`${API_ENDPOINTS.WEATHER.FORECAST}?lat=${lat}&lon=${lon}&days=${days}`);
      setForecast(data.forecast || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    forecast,
    loading,
    error,
    fetchCurrentWeather,
    fetchForecast,
  };
}

