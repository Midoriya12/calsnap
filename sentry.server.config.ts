import * as Sentry from '@sentry/nextjs';

/**
 * Sentry Server-Side Configuration
 *
 * To enable Sentry:
 * 1. Install Sentry: npm install @sentry/nextjs
 * 2. Sign up at https://sentry.io and create a project
 * 3. Add SENTRY_DSN and SENTRY_AUTH_TOKEN to your .env.local
 * 4. Uncomment the Sentry.init() call below
 */

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry
    debug: false,

    // Environment
    environment: process.env.NODE_ENV,

    // Integrate with Next.js instrumentation
    integrations: [
      Sentry.httpIntegration(),
      Sentry.nodeProfilingIntegration(),
    ],

    // Customize data sent to Sentry
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Don't send certain errors in development
      if (process.env.NODE_ENV === 'development') {
        return null;
      }

      // Add custom context
      if (event.request) {
        event.tags = {
          ...event.tags,
          api_route: event.request.url,
        };
      }

      return event;
    },
  });
}
