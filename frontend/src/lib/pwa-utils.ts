/**
 * PWA utility functions for the Freaky Fit app
 */

/**
 * Checks if the app is installed (running in standalone mode)
 * @returns boolean indicating if the app is installed
 */
export function isAppInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
}

/**
 * Detects if the browser supports PWA installation
 * @returns boolean indicating if installation is supported
 */
export function isInstallSupported(): boolean {
  return 'serviceWorker' in navigator && 
    'PushManager' in window &&
    navigator.serviceWorker !== undefined;
}

/**
 * Checks if the device is online
 * @returns boolean indicating if the device is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Attempts to load cached data when offline
 * @param key The cache key
 * @returns The cached data or null if not found
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cache = await caches.open('app-data-cache');
    const response = await cache.match(`data:${key}`);
    
    if (response) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
}

/**
 * Caches data for offline use
 * @param key The cache key
 * @param data The data to cache
 */
export async function cacheData(key: string, data: any): Promise<void> {
  try {
    const cache = await caches.open('app-data-cache');
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(`data:${key}`, response);
  } catch (error) {
    console.error('Error caching data:', error);
  }
} 