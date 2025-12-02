'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect online/offline status
 *
 * Returns true when the user is online, false when offline.
 * Automatically updates when network status changes.
 *
 * @example
 * function MyComponent() {
 *   const isOnline = useOnlineStatus();
 *
 *   return (
 *     <div>
 *       {!isOnline && (
 *         <div className="bg-yellow-100 p-4">
 *           You're offline. Some features may not work.
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook with additional network information
 *
 * Provides more detailed network status including connection type and quality.
 *
 * @example
 * const { isOnline, connectionType, effectiveType } = useNetworkStatus();
 */
export function useNetworkStatus() {
  const isOnline = useOnlineStatus();
  const [networkInfo, setNetworkInfo] = useState<{
    connectionType?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  }>({});

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      const updateNetworkInfo = () => {
        setNetworkInfo({
          connectionType: connection.type,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  return {
    isOnline,
    ...networkInfo,
  };
}

/**
 * Hook that calls a callback when going online/offline
 *
 * @example
 * useOnlineStatusChange({
 *   onOnline: () => console.log('Back online!'),
 *   onOffline: () => console.log('You are offline'),
 * });
 */
export function useOnlineStatusChange(callbacks: {
  onOnline?: () => void;
  onOffline?: () => void;
}) {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline && callbacks.onOnline) {
      callbacks.onOnline();
    } else if (!isOnline && callbacks.onOffline) {
      callbacks.onOffline();
    }
  }, [isOnline, callbacks]);
}
