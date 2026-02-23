'use client';

import { useState, useEffect } from 'react';
import { get, post } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useMessages(userId = null) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const endpoint = userId 
        ? `${API_ENDPOINTS.MESSAGES.BASE}?userId=${userId}`
        : API_ENDPOINTS.MESSAGES.BASE;
      
      const data = await get(endpoint);
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const data = await post(API_ENDPOINTS.MESSAGES.BASE, messageData);
      await fetchMessages(); // Refresh messages
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
}

