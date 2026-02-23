'use client';

import { useState } from 'react';
import { post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useHarvest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const estimateHarvest = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await post(API_ENDPOINTS.HARVEST.ESTIMATE, data);
      return { success: true, estimate: result.estimate };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const predictHarvest = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await post(API_ENDPOINTS.HARVEST.PREDICTIONS, data);
      return { success: true, prediction: result.prediction };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    estimateHarvest,
    predictHarvest,
  };
}

