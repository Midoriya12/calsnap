# 🚀 CalSnap Deployment Guide

This guide walks you through deploying CalSnap to production on Firebase Hosting.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase project created
- [ ] All environment variables configured
- [ ] Firebase security rules deployed
- [ ] All tests passing (when implemented)
- [ ] Production build successful locally

---

## 🔐 Step 1: Environment Setup

### 1.1 Create Production Environment File

```bash
# Create production environment file
cp .env.example .env.production
```

### 1.2 Fill in Production Values

Edit `.env.production` with your production credentials:

```bash
# Google AI API
GOOGLE_API_KEY=your_production_google_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# USDA API
USDA_API_KEY=your_usda_api_key

# Application URL
NEXT_PUBLIC_APP_URL=https://your-production-domain.com

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 1.3 Set Firebase Environment Variables

```bash
# Login to Firebase
firebase login

# Set environment variables in Firebase
firebase functions:config:set \
  google.api_key="your_api_key" \
  usda.api_key="your_usda_key"
```

---

## 🔥 Step 2: Firebase Setup

### 2.1 Initialize Firebase (if not already done)

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Firestore
- ✅ Functions (if using)

### 2.2 Update Firebase Configuration

Ensure `firebase.json` is configured correctly:

```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### 2.3 Deploy Firestore Rules

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

---

## 🏗️ Step 3: Build for Production

### 3.1 Clean Previous Builds

```bash
rm -rf .next
rm -rf out
rm -rf node_modules/.cache
```

### 3.2 Install Dependencies

```bash
npm ci  # Use ci for cleaner installs
```

### 3.3 Run Type Check

```bash
npm run typecheck
```

Fix any TypeScript errors before proceeding.

### 3.4 Run Linter

```bash
npm run lint
```

Fix any linting errors.

### 3.5 Build Application

```bash
npm run build
```

This will:
- Compile TypeScript
- Bundle JavaScript
- Optimize images
- Generate static pages
- Create production build in `.next/`

### 3.6 Test Production Build Locally

```bash
npm run start
```

Visit `http://localhost:3000` and test:
- [ ] User signup/login
- [ ] Meal photo upload and analysis
- [ ] Recipe search
- [ ] Daily log functionality
- [ ] All navigation works
- [ ] No console errors

---

## 🚀 Step 4: Deploy to Firebase

### 4.1 Deploy to Firebase Hosting

```bash
# Deploy everything
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

### 4.2 Verify Deployment

The CLI will output your deployment URL:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project
Hosting URL: https://your-project.web.app
```

### 4.3 Test Production Site

Visit your Hosting URL and test all features:

- [ ] Authentication works
- [ ] AI meal analysis works
- [ ] Recipe catalog loads
- [ ] Daily log saves data
- [ ] All images load correctly
- [ ] Mobile responsive
- [ ] PWA installable

---

## 🎯 Step 5: Post-Deployment Checks

### 5.1 Monitor Error Tracking

Check Sentry dashboard for any errors:

```bash
https://sentry.io/organizations/your-org/issues/
```

### 5.2 Check Firebase Console

Monitor:
- [ ] Authentication users
- [ ] Firestore reads/writes
- [ ] Hosting traffic
- [ ] Costs and usage

### 5.3 Test API Rate Limiting

```bash
# Test rate limiting is working
for i in {1..65}; do
  curl "https://your-domain.com/api/nutrition?ingredientName=chicken"
done
```

Should see 429 errors after 60 requests.

### 5.4 Run Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🔄 Step 6: Continuous Deployment (Optional)

### 6.1 GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_APP_URL: https://calsnap.web.app

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### 6.2 Add GitHub Secrets

Go to GitHub → Settings → Secrets and add:
- `FIREBASE_SERVICE_ACCOUNT`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`

---

## 🛡️ Security Checklist

Before going live, verify:

- [ ] All environment variables are set in production
- [ ] Firestore security rules deployed
- [ ] API rate limiting active
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] No sensitive data in client bundle
- [ ] Firebase billing alerts set
- [ ] Sentry error tracking active
- [ ] No console.log in production code

---

## 💰 Cost Monitoring

### Firebase Free Tier Limits

Monitor these limits:
- Firestore: 50k reads/day, 20k writes/day
- Hosting: 10 GB storage, 360 MB/day bandwidth
- Authentication: Unlimited

### Set Billing Alerts

```bash
# Set up billing alerts at 50%, 80%, 100% of budget
firebase deploy --only functions:billingAlert
```

Or manually in Firebase Console:
1. Go to Billing
2. Set up budget alerts
3. Alert at $10, $50, $100 (adjust as needed)

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm ci
npm run build
```

### Deployment Fails

```bash
# Re-login to Firebase
firebase logout
firebase login
firebase deploy
```

### 404 Errors After Deployment

Check `firebase.json` rewrites configuration.

### Firestore Permission Denied

```bash
# Redeploy rules
firebase deploy --only firestore:rules
```

### High Costs

- Check Firebase Console > Usage
- Review Firestore queries (add pagination)
- Limit AI API calls per user
- Enable caching

---

## 📊 Monitoring

### Firebase Console

Monitor daily:
- Authentication users
- Firestore operations
- Hosting traffic
- Costs

### Sentry Dashboard

Check for:
- Error rates
- New issues
- Performance bottlenecks

### Google Analytics

Track:
- User signups
- Meal analyses
- Recipe views
- Daily active users

---

## 🔄 Rollback Procedure

If something goes wrong:

```bash
# List recent deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## 📝 Deployment Checklist

Use this checklist for each deployment:

**Pre-Deployment:**
- [ ] All tests pass
- [ ] Type check passes
- [ ] Lint passes
- [ ] Build succeeds locally
- [ ] Tested locally with `npm run start`
- [ ] Environment variables set
- [ ] Firestore rules deployed

**Deployment:**
- [ ] `npm run build` succeeds
- [ ] `firebase deploy` succeeds
- [ ] Production URL accessible

**Post-Deployment:**
- [ ] All features work in production
- [ ] No console errors
- [ ] Sentry showing no critical errors
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] PWA installable

**Monitoring (First 24h):**
- [ ] Check error rates every 2 hours
- [ ] Monitor costs
- [ ] Watch user signups
- [ ] Review analytics

---

## 🎉 Success!

Your CalSnap application is now live in production!

**Next Steps:**
1. Share the URL with beta testers
2. Monitor error rates and costs
3. Gather user feedback
4. Iterate and improve

---

## 📞 Support

If you encounter issues:
- Check [Firebase Status](https://status.firebase.google.com/)
- Review [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Check Sentry error logs
- Review Firebase Console logs

Good luck! 🚀
