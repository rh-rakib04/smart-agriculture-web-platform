'use client';

import { useState, useEffect } from 'react';
import { get } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useCrops(farmerId = null) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, [farmerId]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const endpoint = farmerId 
        ? API_ENDPOINTS.FARMERS.CROPS(farmerId)
        : API_ENDPOINTS.CROPS.BASE;
      
      const data = await get(endpoint);
      setCrops(data.crops || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { crops, loading, error, refetch: fetchCrops };
}

