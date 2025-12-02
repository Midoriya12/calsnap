'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Offline Banner Component
 *
 * Displays a banner when the user loses internet connection.
 * Automatically dismisses when connection is restored.
 *
 * Add this to your root layout for global offline detection.
 *
 * @example
 * // In layout.tsx
 * <body>
 *   <OfflineBanner />
 *   {children}
 * </body>
 */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Add a small delay before hiding to show "back online" message
      const timer = setTimeout(() => setShowBanner(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-yellow-600 text-white'
      }`}
      role="alert"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-2">
        {!isOnline && <WifiOff className="h-5 w-5" />}
        <p className="text-sm font-medium">
          {isOnline
            ? '✓ You are back online'
            : 'You are offline - Some features may not work'}
        </p>
      </div>
    </div>
  );
}
