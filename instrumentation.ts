/**
 * Next.js Instrumentation File
 * This file is used to initialize Sentry and other monitoring tools
 *
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    await import('./sentry.edge.config');
  }
}

export const onRequestError = async (
  err: Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  }
) => {
  // Log errors for monitoring
  console.error('Request error:', {
    error: err.message,
    path: request.path,
    method: request.method,
  });

  // Import Sentry dynamically to avoid issues if not configured
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(err, {
      tags: {
        path: request.path,
        method: request.method,
      },
    });
  }
};
