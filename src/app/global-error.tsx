'use client';

import { useEffect } from 'react';

/**
 * Global error boundary for the entire application
 * This catches errors in the root layout
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);

    // Report to Sentry if available
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureException(error);
      });
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
          <div className="max-w-md text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-red-600">Critical Error</h1>
              <h2 className="text-2xl font-semibold">
                Application Failed to Load
              </h2>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-gray-700">
                {error.message || 'A critical error occurred'}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-gray-600">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Go home
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Please refresh the page or contact support if the issue persists.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
