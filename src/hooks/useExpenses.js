'use client';

import { useState, useEffect } from 'react';
import { get, post, put, del } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useExpenses(farmerId = null) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [farmerId]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const endpoint = farmerId 
        ? `${API_ENDPOINTS.EXPENSES.BASE}?farmerId=${farmerId}`
        : API_ENDPOINTS.EXPENSES.BASE;
      
      const data = await get(endpoint);
      setExpenses(data.expenses || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const data = await post(API_ENDPOINTS.EXPENSES.BASE, expenseData);
      await fetchExpenses();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const data = await put(API_ENDPOINTS.EXPENSES.BY_ID(id), expenseData);
      await fetchExpenses();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await del(API_ENDPOINTS.EXPENSES.BY_ID(id));
      await fetchExpenses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}


