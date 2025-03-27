import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function PWAStatus() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Setup the service worker
  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    }
  });

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto hide the offline ready message after 5 seconds
  useEffect(() => {
    if (offlineReady) {
      const timer = setTimeout(() => {
        setOfflineReady(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const refresh = () => {
    updateServiceWorker(true);
  };

  if (!offlineReady && !needRefresh && isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-lg mb-2">
          <p className="flex items-center">
            <span className="mr-2">📶</span>
            You're currently offline.
          </p>
        </div>
      )}

      {offlineReady && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg shadow-lg mb-2">
          <div className="flex justify-between items-center">
            <p className="flex items-center">
              <span className="mr-2">✅</span>
              App ready to work offline
            </p>
            <button 
              onClick={close}
              className="text-green-800 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {needRefresh && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <p className="flex items-center">
              <span className="mr-2">🔄</span>
              New content available
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={refresh} 
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Reload
              </button>
              <button 
                onClick={close}
                className="text-blue-800 hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 