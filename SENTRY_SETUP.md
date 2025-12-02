# Sentry Setup Guide for CalSnap

This guide will help you set up Sentry for error tracking and performance monitoring in production.

## Why Sentry?

Sentry provides:
- Real-time error tracking
- Performance monitoring
- Session replays
- Release tracking
- User feedback collection
- Alert notifications

## Setup Steps

### 1. Install Sentry SDK

```bash
npm install @sentry/nextjs
```

### 2. Sign Up for Sentry

1. Go to [sentry.io](https://sentry.io)
2. Create a free account
3. Create a new project (select "Next.js" as platform)
4. Copy your DSN (Data Source Name)

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Sentry DSN (get this from Sentry.io project settings)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456

# Sentry Auth Token (for source maps upload - optional)
SENTRY_AUTH_TOKEN=your_auth_token_here

# Organization and Project (for source maps upload - optional)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
```

### 4. Run Sentry Wizard (Optional)

Sentry provides a wizard to auto-configure your project:

```bash
npx @sentry/wizard@latest -i nextjs
```

This will:
- Create Sentry config files (already created manually)
- Update `next.config.ts` with Sentry webpack plugin
- Set up source maps upload

### 5. Update next.config.ts for Source Maps (Optional)

For better error tracking with source maps in production:

```typescript
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  // ... your existing config
};

export default withSentryConfig(
  nextConfig,
  {
    // Sentry Webpack Plugin Options
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Upload source maps during build
    silent: true,

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements
    disableLogger: true,
  }
);
```

### 6. Test Sentry Integration

Add a test error to verify Sentry is working:

```typescript
// In any page or component
<button onClick={() => {
  throw new Error('Test Sentry Error');
}}>
  Trigger Test Error
</button>
```

Click the button and check your Sentry dashboard for the error.

### 7. Configure Alerts (Recommended)

In Sentry dashboard:
1. Go to **Alerts** → **Create Alert**
2. Set up alerts for:
   - New issues
   - Error rate threshold exceeded
   - Performance degradation

## Features Already Configured

✅ **Client-side error tracking** - `sentry.client.config.ts`
✅ **Server-side error tracking** - `sentry.server.config.ts`
✅ **Edge runtime tracking** - `sentry.edge.config.ts`
✅ **Instrumentation hook** - `instrumentation.ts`
✅ **Error boundaries** - `error.tsx`, `global-error.tsx`
✅ **Session replay** - Configured at 10% sample rate
✅ **Performance monitoring** - Configured at 10% sample rate

## Monitoring Best Practices

### 1. Set Appropriate Sample Rates

Adjust in `sentry.client.config.ts`:

```typescript
tracesSampleRate: 0.1,  // 10% of transactions (good for production)
replaysSessionSampleRate: 0.1,  // 10% of sessions
replaysOnErrorSampleRate: 1.0,  // 100% of error sessions
```

For high-traffic apps, lower these rates to reduce costs.

### 2. Filter Sensitive Data

Already configured to filter out:
- Browser extension errors
- ResizeObserver errors
- Non-critical errors

Add more filters in `beforeSend` if needed.

### 3. Add User Context

When users are authenticated, add user context:

```typescript
import * as Sentry from '@sentry/nextjs';

// In your auth context after login
Sentry.setUser({
  id: user.uid,
  email: user.email,
});

// On logout
Sentry.setUser(null);
```

### 4. Add Custom Tags

Tag errors for better filtering:

```typescript
Sentry.setTag('feature', 'meal-analysis');
Sentry.setTag('user_plan', 'premium');
```

### 5. Capture Custom Events

For important business events:

```typescript
Sentry.captureMessage('User upgraded to premium', 'info');
```

## Cost Management

Sentry Free Tier includes:
- 5,000 errors/month
- 10,000 performance units/month
- 50 session replays/month

To stay within limits:
- Use low sample rates (5-10%)
- Filter out non-critical errors
- Use `ignoreErrors` to exclude known issues

## Production Checklist

Before deploying to production:

- [ ] Add `NEXT_PUBLIC_SENTRY_DSN` to production environment
- [ ] Configure Sentry alerts for your team
- [ ] Set up Slack/email notifications
- [ ] Test error tracking in staging environment
- [ ] Configure release tracking
- [ ] Set up source maps upload (optional but recommended)
- [ ] Add user context after authentication
- [ ] Configure breadcrumbs for better debugging

## Useful Sentry Features

### Release Tracking

Track which version has errors:

```bash
# During deployment
SENTRY_RELEASE=$(git rev-parse --short HEAD)
```

### Performance Monitoring

Monitor slow API routes and page loads automatically.

### Session Replay

Watch user sessions leading up to errors (privacy-focused, text/media masked).

### Custom Dashboards

Create dashboards for:
- Error rates by feature
- User impact
- Release health
- Performance metrics

## Support

- Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Sentry Status: https://status.sentry.io/
- Community: https://discord.gg/sentry

## Alternatives to Sentry

If Sentry doesn't fit your needs:
- **LogRocket** - Session replay + logging
- **Rollbar** - Error tracking
- **Bugsnag** - Error monitoring
- **DataDog** - Full observability platform
- **New Relic** - APM + error tracking
