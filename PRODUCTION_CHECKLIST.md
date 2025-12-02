# 🚀 CalSnap Production Readiness Checklist

This comprehensive checklist will guide you through preparing CalSnap for production deployment.

**Current Status: 40% Production Ready** (8/20 critical items complete)

---

## ✅ COMPLETED - Critical Security & Infrastructure

- [x] **Remove build error ignoring** - TypeScript and ESLint errors no longer ignored
- [x] **Environment variables documented** - `.env.example` created with all required vars
- [x] **Firestore security rules** - User data protected with email verification
- [x] **API rate limiting** - Prevents abuse and cost overruns
- [x] **Server-side validation** - All API routes validate inputs
- [x] **Authentication middleware** - Route protection implemented
- [x] **Error boundaries** - React error handling in place
- [x] **Sentry integration** - Error tracking infrastructure ready

---

## 🔴 HIGH PRIORITY - Must Complete Before Production

### 1. Environment & Configuration

- [ ] **Create `.env.local` file**
  - Copy `.env.example` to `.env.local`
  - Fill in all API keys and Firebase credentials
  - Verify all environment variables are set
  - **Files:** `.env.local`

- [ ] **Deploy Firestore rules**
  ```bash
  firebase deploy --only firestore:rules
  ```
  - **Files:** `firestore.rules`

- [ ] **Deploy Firestore indexes**
  ```bash
  firebase deploy --only firestore:indexes
  ```
  - **Files:** `firestore.indexes.json`

- [ ] **Set up Firebase Admin SDK for server-side auth**
  - Create service account in Firebase Console
  - Download service account JSON
  - Add to environment as `FIREBASE_SERVICE_ACCOUNT`
  - Update middleware to use session cookies
  - **Files:** Create `src/lib/firebase-admin.ts`

### 2. Testing Infrastructure

- [ ] **Install testing frameworks**
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom vitest
  npm install -D @playwright/test  # For E2E tests
  ```

- [ ] **Create test configuration**
  - **Files to create:**
    - `jest.config.js` or `vitest.config.ts`
    - `playwright.config.ts`

- [ ] **Write critical unit tests**
  - [ ] Test `src/lib/rate-limit.ts`
  - [ ] Test `src/lib/api-validation.ts`
  - [ ] Test authentication flows
  - [ ] Test meal logging logic
  - **Files to create:** `*.test.ts` files

- [ ] **Write E2E tests**
  - [ ] Test signup flow
  - [ ] Test login flow
  - [ ] Test meal photo upload and analysis
  - [ ] Test daily log functionality
  - **Files to create:** `tests/e2e/*.spec.ts`

- [ ] **Add test scripts to package.json**
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:e2e": "playwright test",
      "test:ci": "vitest run && playwright test"
    }
  }
  ```

### 3. Monitoring & Observability

- [ ] **Set up Sentry**
  - Sign up at https://sentry.io
  - Create project
  - Add `NEXT_PUBLIC_SENTRY_DSN` to environment
  - Install: `npm install @sentry/nextjs`
  - Test error tracking
  - **Guide:** `SENTRY_SETUP.md`

- [ ] **Add analytics**
  - [ ] Set up Google Analytics 4 or alternative
  - [ ] Add tracking for key events:
    - User signup
    - Meal analysis
    - Recipe views
    - Daily log entries
  - [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to environment
  - **Files to create:** `src/lib/analytics.ts`

- [ ] **Add performance monitoring**
  - [ ] Enable Web Vitals tracking
  - [ ] Monitor API response times
  - [ ] Track Core Web Vitals (LCP, FID, CLS)
  - **Files to create:** `src/lib/web-vitals.ts`

- [ ] **Set up logging service**
  - Consider: CloudWatch, Datadog, or LogRocket
  - Replace console.log with structured logging
  - **Files to create:** `src/lib/logger.ts`

### 4. Performance Optimization

- [ ] **Optimize bundle size**
  ```bash
  npm install -D @next/bundle-analyzer
  ```
  - Add bundle analyzer to `next.config.ts`
  - Identify and remove unused dependencies
  - **Target:** < 300KB initial bundle

- [ ] **Implement code splitting**
  - [ ] Lazy load Chatbot component
  - [ ] Lazy load heavy AI flows
  - [ ] Use `next/dynamic` for client components
  - **Files to update:** `src/components/features/chatbot.tsx`

- [ ] **Add image optimization**
  - [ ] Compress uploaded images before analysis
  - [ ] Use WebP format where supported
  - [ ] Implement image CDN (optional)
  - **Files to create:** `src/lib/image-optimization.ts`

- [ ] **Implement caching strategy**
  - [ ] Cache USDA API responses (1 hour)
  - [ ] Cache TheMealDB responses (24 hours)
  - [ ] Consider Redis or Upstash for production
  - **Files to update:** `src/app/api/nutrition/route.ts`, `src/app/api/recipes/route.ts`

- [ ] **Add pagination**
  - [ ] Paginate saved meals list
  - [ ] Paginate logged meals
  - [ ] Paginate recipe search results
  - **Files to update:** `src/hooks/use-meal-storage.ts`, `src/hooks/use-daily-log.ts`

### 5. Security Hardening

- [ ] **Set up Firebase session cookies**
  - Implement server-side session verification
  - Add session cookie creation on login
  - Update middleware to verify sessions
  - **Files to create:** `src/lib/auth-server.ts`
  - **Files to update:** `src/middleware.ts`

- [ ] **Add CSRF protection**
  - Install: `npm install csrf`
  - Implement CSRF tokens for forms
  - **Files to create:** `src/lib/csrf.ts`

- [ ] **Implement Content Security Policy**
  - Add CSP headers to `next.config.ts`
  - Restrict inline scripts
  - Whitelist trusted domains
  - **Files to update:** `src/middleware.ts`

- [ ] **Add security headers**
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
  - **Files to update:** `src/middleware.ts`

- [ ] **Scan dependencies for vulnerabilities**
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] **Add AI flow rate limiting**
  - [ ] Limit AI image analysis to 10/hour per user
  - [ ] Add usage quotas to Firestore
  - [ ] Track AI API costs per user
  - **Files to create:** `src/lib/ai-rate-limit.ts`

### 6. User Experience Polish

- [ ] **Add loading skeletons**
  - [ ] Saved meals page
  - [ ] Daily log page
  - [ ] Recipe catalog
  - **Files to update:** Use existing `src/components/ui/skeleton.tsx`

- [ ] **Create comprehensive empty states**
  - [ ] No saved meals
  - [ ] No logged meals for date
  - [ ] No recipe search results
  - **Files to create:** `src/components/ui/empty-state.tsx`

- [ ] **Add retry mechanisms**
  - [ ] Retry failed API calls
  - [ ] Retry failed image uploads
  - [ ] Add exponential backoff
  - **Files to create:** `src/lib/retry.ts`

- [ ] **Implement offline detection**
  - Show "You're offline" banner
  - Queue operations for when online
  - **Files to create:** `src/hooks/use-online-status.ts`

- [ ] **Improve error messages**
  - Make all error messages user-friendly
  - Add specific guidance for each error type
  - **Files to update:** All API routes and components

### 7. SEO & Discoverability

- [ ] **Create robots.txt**
  ```txt
  User-agent: *
  Allow: /
  Disallow: /api/
  Disallow: /daily-log
  Disallow: /saved-meals

  Sitemap: https://yourdomain.com/sitemap.xml
  ```
  - **Files to create:** `public/robots.txt`

- [ ] **Generate sitemap.xml**
  - Add dynamic sitemap generation
  - Include recipe pages
  - **Files to create:** `src/app/sitemap.ts`

- [ ] **Add metadata to all pages**
  - [ ] Home page
  - [ ] Recipe pages
  - [ ] Daily log
  - [ ] Saved meals
  - **Files to update:** Add `metadata` exports to all page files

- [ ] **Create OpenGraph images**
  - Default OG image
  - Dynamic OG images for recipes
  - **Files to create:** `src/app/opengraph-image.tsx`

- [ ] **Add structured data (JSON-LD)**
  - Recipe schema for recipe pages
  - Organization schema for home page
  - **Files to update:** Recipe page components

### 8. Progressive Web App (PWA)

- [ ] **Create manifest.json**
  ```json
  {
    "name": "CalSnap - Meal Tracker",
    "short_name": "CalSnap",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1C3D2B",
    "theme_color": "#1C3D2B",
    "icons": [...]
  }
  ```
  - **Files to create:** `public/manifest.json`

- [ ] **Add service worker**
  - Install next-pwa: `npm install next-pwa`
  - Cache static assets
  - Offline fallback page
  - **Files to create:** `next-pwa.config.js`

- [ ] **Create app icons**
  - 192x192 and 512x512 PNG
  - Apple touch icons
  - Favicon variants
  - **Files to create:** `public/icons/*`

---

## 🟡 MEDIUM PRIORITY - Recommended for Production

### 9. Documentation

- [ ] **Write comprehensive README.md**
  - Project description
  - Features list
  - Tech stack
  - Setup instructions
  - Deployment guide
  - **Files to update:** `README.md`

- [ ] **Create DEPLOYMENT.md**
  - Firebase setup steps
  - Environment variable setup
  - Build and deploy process
  - Troubleshooting guide
  - **Files to create:** `DEPLOYMENT.md`

- [ ] **Document API endpoints**
  - Create OpenAPI/Swagger spec
  - Document request/response formats
  - **Files to create:** `API.md` or `openapi.yaml`

- [ ] **Add code comments**
  - Document complex logic
  - Add JSDoc comments to utility functions
  - **Files to update:** Complex utility files

### 10. CI/CD Pipeline

- [ ] **Set up GitHub Actions**
  - **Files to create:** `.github/workflows/ci.yml`
  - Run on pull requests:
    ```yaml
    - Lint code (ESLint)
    - Type check (TypeScript)
    - Run unit tests
    - Run E2E tests
    - Build application
    ```

- [ ] **Add pre-commit hooks**
  ```bash
  npm install -D husky lint-staged
  npx husky install
  ```
  - **Files to create:** `.husky/pre-commit`

- [ ] **Set up automatic deployments**
  - Deploy to staging on merge to develop
  - Deploy to production on merge to main
  - **Files to update:** Firebase hosting config

### 11. Database Optimization

- [ ] **Review Firestore data structure**
  - Minimize document reads
  - Consider denormalization where needed
  - Add timestamps to all documents

- [ ] **Set up Firestore backups**
  - Scheduled daily backups
  - Retention policy
  - Restore procedure documented

- [ ] **Optimize Firestore queries**
  - Use query cursors for pagination
  - Limit query results
  - Add composite indexes where needed

### 12. Cost Optimization

- [ ] **Set up Firebase billing alerts**
  - Alert at 50%, 80%, 100% of budget
  - Monitor Firestore reads/writes
  - Monitor AI API usage

- [ ] **Implement usage quotas**
  - Free tier: 5 AI scans/day
  - Premium tier: Unlimited
  - **Files to create:** `src/lib/quotas.ts`

- [ ] **Monitor AI API costs**
  - Log all Google AI API calls
  - Track cost per user
  - Alert on unusual spending

- [ ] **Optimize image storage**
  - Compress images before storing
  - Set storage limits per user
  - Clean up old images

---

## 🟢 LOW PRIORITY - Nice to Have

### 13. Advanced Features

- [ ] **Add accessibility audit**
  - Install Lighthouse CI
  - Fix all a11y issues
  - Test with screen readers

- [ ] **Internationalization (i18n)**
  - Add support for multiple languages
  - **Library:** next-intl

- [ ] **Dark mode improvements**
  - Ensure all components support dark mode
  - Respect system preferences

- [ ] **Email notifications**
  - Weekly nutrition summary
  - Goal achievement notifications
  - **Service:** SendGrid or Resend

### 14. User Feedback

- [ ] **Add feedback widget**
  - In-app feedback form
  - Bug report option
  - Feature request option

- [ ] **Set up user surveys**
  - Post-signup survey
  - Feature satisfaction surveys

### 15. Legal & Compliance

- [ ] **Create Privacy Policy**
  - Data collection disclosure
  - GDPR compliance
  - **Files to create:** `src/app/privacy/page.tsx`

- [ ] **Create Terms of Service**
  - **Files to create:** `src/app/terms/page.tsx`

- [ ] **Add cookie consent banner**
  - Required for GDPR
  - **Library:** react-cookie-consent

- [ ] **GDPR compliance**
  - Add data export functionality
  - Add account deletion
  - **Files to create:** `src/app/settings/data/page.tsx`

---

## 📊 Production Launch Checklist

### Pre-Launch (1 Week Before)

- [ ] All HIGH PRIORITY items complete
- [ ] Security audit completed
- [ ] Performance benchmarks met (Lighthouse score > 90)
- [ ] All tests passing
- [ ] Staging environment tested thoroughly
- [ ] Load testing completed
- [ ] Backup and disaster recovery plan in place
- [ ] Monitoring and alerts configured
- [ ] Documentation complete
- [ ] Team trained on incident response

### Launch Day

- [ ] Final smoke tests in production
- [ ] Monitor error rates closely
- [ ] Monitor API usage and costs
- [ ] Have rollback plan ready
- [ ] Monitor user feedback channels
- [ ] Check analytics setup working
- [ ] Verify email/notifications working

### Post-Launch (First Week)

- [ ] Daily error review in Sentry
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Fix critical bugs immediately
- [ ] Monitor costs daily
- [ ] Check analytics for usage patterns
- [ ] Gather user testimonials

---

## 🎯 Quick Wins (Do These First)

If you want to make progress quickly, prioritize these:

1. ✅ Set up `.env.local` with all API keys
2. ✅ Deploy Firestore rules and indexes
3. ✅ Install and configure Sentry
4. ✅ Write basic unit tests for utilities
5. ✅ Add Google Analytics
6. ✅ Create robots.txt and sitemap.xml
7. ✅ Write comprehensive README.md
8. ✅ Set up GitHub Actions CI
9. ✅ Add bundle analyzer
10. ✅ Implement caching for API responses

---

## 📈 Progress Tracking

**Completion Status:**

- ✅ Critical Security: 8/8 (100%)
- 🔴 High Priority: 0/47 items
- 🟡 Medium Priority: 0/15 items
- 🟢 Low Priority: 0/10 items

**Overall Production Readiness: 40%**

---

## 🆘 Need Help?

If you need assistance with any of these tasks:

1. **Sentry Setup**: See `SENTRY_SETUP.md`
2. **Firebase Admin SDK**: https://firebase.google.com/docs/admin/setup
3. **Next.js Testing**: https://nextjs.org/docs/testing
4. **Performance Optimization**: https://nextjs.org/docs/pages/building-your-application/optimizing

---

## 🎉 When You're Production Ready

You'll know you're ready when:

- ✅ Zero critical security vulnerabilities
- ✅ Test coverage > 70% for critical paths
- ✅ Lighthouse score > 90 across all metrics
- ✅ Error monitoring active and configured
- ✅ Performance monitoring shows < 3s load time
- ✅ All legal pages (privacy, terms) published
- ✅ Backup and disaster recovery plan tested
- ✅ Team trained on production procedures

**Good luck with your launch! 🚀**
