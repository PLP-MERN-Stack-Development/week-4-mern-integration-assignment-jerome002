// Custom hook for API calls with loading and error states
import { useState, useEffect } from 'react';
import { ApiResponse } from '../types';

export const useApi = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'An error occurred');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};

export const useApiMutation = <T, P = any>(
  apiCall: (params: P) => Promise<ApiResponse<T>>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(params);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'An error occurred');
        return null;
      }
    } catch (err) {
      setError('Network error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};