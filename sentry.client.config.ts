import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Client-Side Configuration
 *
 * To enable Sentry:
 * 1. Install Sentry: npm install @sentry/nextjs
 * 2. Sign up at https://sentry.io and create a project
 * 3. Add NEXT_PUBLIC_SENTRY_DSN to your .env.local
 * 4. Uncomment the Sentry.init() call below
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    // Percentage of transactions to send to Sentry (0.0 to 1.0)
    tracesSampleRate: 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry
    debug: false,

    // Replays for Session Replay
    // Sample rate for replays (0.0 to 1.0)
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Environment
    environment: process.env.NODE_ENV,

    // Filter out known errors
    ignoreErrors: [
      // Browser extension errors
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],

    // Customize data sent to Sentry
    beforeSend(event, hint) {
      // Filter out events you don't want to track
      const error = hint.originalException;

      // Don't send network errors for development
      if (
        process.env.NODE_ENV === 'development' &&
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message.includes('NetworkError')
      ) {
        return null;
      }

      return event;
    },
  });
}
