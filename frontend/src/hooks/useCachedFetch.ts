import { useState, useEffect } from 'react';
import { isOnline, getCachedData, cacheData } from '../lib/pwa-utils';

interface UseCachedFetchOptions {
  cacheDuration?: number;  // Time in milliseconds before cache is considered stale
  skipCache?: boolean;     // Skip cache even if available and fetch from network
  forceFresh?: boolean;    // Always try network first, fall back to cache
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isFromCache: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching data with offline caching capability
 * 
 * @param url The URL to fetch data from
 * @param options Configuration options for the fetch operation
 * @returns Object containing data, loading state, error, and refresh function
 */
export function useCachedFetch<T>(
  url: string, 
  options: UseCachedFetchOptions = {}
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const { 
    cacheDuration = 1000 * 60 * 60, // 1 hour by default
    skipCache = false,
    forceFresh = false
  } = options;

  const cacheKey = `fetch:${url}`;

  const fetchData = async (skipCacheOverride = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check if we're online
      const online = isOnline();

      // Try loading from cache first, unless skipCache is true or we're forcing fresh data
      if (!skipCache && !skipCacheOverride && !forceFresh) {
        const cachedResult = await getCachedData<{
          data: T; 
          timestamp: number;
        }>(cacheKey);

        // Use cache if we have it, it's not expired, or we're offline
        if (cachedResult) {
          const isCacheValid = Date.now() - cachedResult.timestamp < cacheDuration;
          
          if (isCacheValid || !online) {
            setData(cachedResult.data);
            setIsFromCache(true);
            setLoading(false);
            
            // If we're online but using cache, still fetch fresh data in the background
            if (online && !isCacheValid) {
              fetchFromNetwork();
            }
            
            return;
          }
        }
      }

      // If we're offline and don't have cache, or skip cache is true
      if (!online) {
        throw new Error('You are offline and no cached data is available');
      }

      // Fetch from network
      await fetchFromNetwork();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  };

  const fetchFromNetwork = async () => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      // Save the fetched data and also cache it
      setData(result);
      setIsFromCache(false);
      
      // Cache the data for future offline use
      await cacheData(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh the data
  const refresh = async () => {
    await fetchData(true); // Skip cache when refreshing
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, isFromCache, refresh };
} 