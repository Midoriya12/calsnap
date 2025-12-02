'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);

    // Report to Sentry if available
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureException(error);
      });
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
        </div>

        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => reset()}
            variant="default"
            className="w-full sm:w-auto"
          >
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Go home
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
