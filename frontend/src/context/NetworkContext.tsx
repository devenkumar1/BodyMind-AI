import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isOnline } from '../lib/pwa-utils';

interface NetworkContextType {
  online: boolean;
  lastOnlineAt: Date | null;
  lastOfflineAt: Date | null;
}

const NetworkContext = createContext<NetworkContextType>({
  online: isOnline(),
  lastOnlineAt: null,
  lastOfflineAt: null
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [online, setOnline] = useState(isOnline());
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(online ? new Date() : null);
  const [lastOfflineAt, setLastOfflineAt] = useState<Date | null>(online ? null : new Date());

  useEffect(() => {
    // Handler for online event
    const handleOnline = () => {
      setOnline(true);
      setLastOnlineAt(new Date());
    };

    // Handler for offline event
    const handleOffline = () => {
      setOnline(false);
      setLastOfflineAt(new Date());
    };

    // Subscribe to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      // Cleanup event listeners on unmount
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = {
    online,
    lastOnlineAt,
    lastOfflineAt
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
} 