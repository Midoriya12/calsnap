# 🍽️ CalSnap - AI-Powered Meal Tracking & Nutrition App

> Snap your meals, track your nutrition, discover recipes - all powered by AI

CalSnap is a modern, full-stack nutrition tracking application that uses AI to analyze food photos, estimate calories, and help users understand their daily nutrition intake. Built with Next.js 15, Firebase, and Google's Gemini AI.

[![Production Ready](https://img.shields.io/badge/Production%20Ready-40%25-yellow)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## ✨ Features

### 📸 AI-Powered Meal Analysis
- **Snap & Analyze**: Take photos of your meals and get instant AI-powered calorie estimates
- **Ingredient Detection**: Automatically identify ingredients from meal photos
- **Recipe Generation**: Get complete recipes with prep time, ingredients, and step-by-step instructions
- **Smart Recognition**: Detects dish names, portion sizes, and nutritional content

### 📊 Daily Nutrition Tracking
- **Calendar-Based Logging**: Track meals by date with an intuitive calendar interface
- **Macro Tracking**: Monitor calories, protein, fat, carbs, and fiber
- **Daily Totals Dashboard**: See aggregated nutrition data at a glance
- **Manual Entry**: Add meals manually when not using AI analysis

### 🍳 Recipe Discovery
- **Browse Recipes**: Explore thousands of recipes from TheMealDB
- **Smart Search**: Find recipes by name, ingredients, or dietary restrictions
- **Detailed Instructions**: Step-by-step cooking instructions with ingredients list
- **Video Tutorials**: YouTube links for visual cooking guides (when available)

### 💬 AI Chatbot Assistant
- **Nutrition Questions**: Ask about calories, ingredients, and meal planning
- **Recipe Recommendations**: Get personalized recipe suggestions
- **Ingredient Information**: Learn about nutritional values and food composition
- **Conversational AI**: Natural language understanding powered by Google Gemini

### 🔐 User Authentication
- **Secure Login**: Email/password authentication via Firebase Auth
- **Email Verification**: Required for account activation
- **Password Reset**: Self-service password recovery
- **Protected Routes**: Server-side authentication middleware

### 💾 Data Management
- **Save Meals**: Build a personal collection of analyzed meals
- **Persistent Storage**: Cloud-based storage with Firebase Firestore
- **User-Scoped Data**: Complete data isolation between users
- **Export Ready**: Prepared for data export functionality

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.3.3](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API

### Backend & AI
- **AI Framework**: [Firebase Genkit](https://firebase.google.com/products/genkit)
- **AI Model**: Google Gemini 2.0 Flash
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth)
- **Hosting**: Firebase Hosting

### External APIs
- **Nutrition Data**: [USDA FoodData Central API](https://fdc.nal.usda.gov/)
- **Recipe Database**: [TheMealDB API](https://www.themealdb.com/api.php)
- **AI Processing**: [Google AI (Gemini)](https://ai.google.dev/)

### Production Infrastructure
- **Error Tracking**: Sentry (configured, not yet active)
- **Rate Limiting**: Custom in-memory implementation
- **Validation**: Zod schemas for API routes
- **Monitoring**: Next.js Instrumentation + Sentry

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account ([console.firebase.google.com](https://console.firebase.google.com))
- Google AI API key ([aistudio.google.com](https://aistudio.google.com/app/apikey))
- USDA API key ([fdc.nal.usda.gov](https://fdc.nal.usda.gov/api-key-signup.html))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Midoriya12/calsnap.git
   cd calsnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys and Firebase credentials in `.env.local`:
   - `GOOGLE_API_KEY` - Your Google AI API key
   - `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (from Firebase Console)
   - `USDA_API_KEY` - USDA FoodData Central API key
   - `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for development)

4. **Set up Firebase**

   a. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

   b. Enable Authentication (Email/Password provider)

   c. Create a Firestore database

   d. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
calsnap/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── nutrition/     # USDA nutrition API
│   │   │   └── recipes/       # TheMealDB API
│   │   ├── daily-log/         # Daily nutrition log page
│   │   ├── recipes/           # Recipe catalog & details
│   │   ├── saved-meals/       # Saved meals collection
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   ├── error.tsx          # Error boundary
│   │   └── layout.tsx         # Root layout
│   ├── ai/                    # AI flows & configuration
│   │   ├── flows/             # Genkit AI flows
│   │   │   ├── guess-calories-from-image.ts
│   │   │   ├── detect-ingredients-from-image.ts
│   │   │   └── recipe-chat-flow.ts
│   │   └── genkit.ts          # Genkit configuration
│   ├── components/            # React components
│   │   ├── features/          # Feature components
│   │   ├── ui/                # UI components (Radix)
│   │   └── error-boundary.tsx # Reusable error boundary
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts        # Authentication hook
│   │   ├── use-daily-log.ts   # Daily log hook
│   │   └── use-meal-storage.ts # Saved meals hook
│   ├── lib/                   # Utility libraries
│   │   ├── firebase.ts        # Firebase client config
│   │   ├── rate-limit.ts      # Rate limiting utility
│   │   ├── api-validation.ts  # Zod validation schemas
│   │   └── utils.ts           # Helper functions
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Next.js middleware (auth)
├── public/                    # Static assets
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore query indexes
├── .env.example               # Environment variables template
├── next.config.ts             # Next.js configuration
└── tailwind.config.ts         # Tailwind CSS configuration
```

---

## 🔒 Security

CalSnap implements multiple layers of security:

- ✅ **Firestore Security Rules**: User data protected with email verification requirements
- ✅ **API Rate Limiting**: 60 req/min for nutrition API, 100 req/min for recipes API
- ✅ **Server-Side Validation**: Zod schemas validate all API inputs
- ✅ **Authentication Middleware**: Protected routes require authentication
- ✅ **Input Sanitization**: Prevents XSS and injection attacks
- ✅ **HTTPS Only**: Production enforces HTTPS connections
- ✅ **Environment Variables**: Sensitive data never committed to git

See `firestore.rules` for complete security configuration.

---

## 🧪 Testing

> **Note**: Testing infrastructure is currently being set up. See `PRODUCTION_CHECKLIST.md` for testing roadmap.

Planned test coverage:
- Unit tests for utilities (rate limiting, validation)
- Integration tests for API routes
- E2E tests for critical user flows (signup, login, meal analysis)
- Component tests for React components

---

## 📊 API Routes

### `GET /api/nutrition?ingredientName={name}`
Fetch nutritional information from USDA FoodData Central.

**Rate Limit**: 60 requests/minute per IP

**Example**:
```bash
curl "http://localhost:3000/api/nutrition?ingredientName=chicken"
```

### `GET /api/recipes?search={query}`
Search recipes from TheMealDB.

**Rate Limit**: 100 requests/minute per IP

**Example**:
```bash
curl "http://localhost:3000/api/recipes?search=pasta"
```

---

## 🎨 Design System

CalSnap uses a custom Tailwind CSS theme:

- **Primary**: Forest Green (#1C3D2B)
- **Background**: Light Beige (#FAF8F3)
- **UI Components**: Radix UI primitives
- **Font**: System font stack for optimal performance
- **Responsive**: Mobile-first design approach

---

## 🚢 Deployment

### Prerequisites for Production

Before deploying, ensure you've completed:

1. ✅ Set up all environment variables in production
2. ✅ Deploy Firestore security rules
3. ✅ Configure Sentry for error tracking
4. ✅ Set up Firebase billing alerts
5. ✅ Test all critical user flows

See `DEPLOYMENT.md` for complete deployment guide (coming soon).

### Quick Deploy to Firebase

```bash
# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 📈 Performance

Current performance metrics (local development):

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: ~85 (target: 90+ for production)

Performance optimizations in progress:
- Bundle size optimization
- Code splitting for heavy components
- API response caching
- Image optimization pipeline

---

## 🐛 Known Issues & Limitations

- **AI Analysis Accuracy**: Calorie estimates are approximate and may vary ±20%
- **Offline Support**: Not yet implemented (requires PWA setup)
- **Mobile App**: Web-only (PWA support coming soon)
- **Recipe Database**: Limited to TheMealDB catalog
- **Rate Limiting**: In-memory only (not suitable for multi-instance deployments)

See [Issues](https://github.com/Midoriya12/calsnap/issues) for complete list.

---

## 🗺️ Roadmap

### ✅ Completed
- [x] AI-powered meal analysis
- [x] Daily nutrition logging
- [x] Recipe catalog
- [x] User authentication
- [x] Security infrastructure
- [x] Rate limiting
- [x] Error handling

### 🚧 In Progress (Next 4 Weeks)
- [ ] Testing infrastructure
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Documentation
- [ ] Sentry activation

### 🎯 Planned Features
- [ ] Freemium subscription model
- [ ] Advanced analytics dashboard
- [ ] AI meal planning
- [ ] Grocery list generation
- [ ] Goal tracking & achievements
- [ ] Social features (share meals)
- [ ] Mobile app (React Native)
- [ ] Barcode scanning
- [ ] Restaurant menu integration

---

## 💰 Monetization Strategy

CalSnap is being prepared for monetization with:

**Free Tier**:
- 5 AI meal scans per day
- Basic daily nutrition log
- Recipe catalog access
- Ad-supported

**Premium Tier** ($4.99-9.99/month):
- Unlimited AI meal scans
- Advanced nutrition analytics
- AI meal planning
- Grocery list generation
- Custom macro goals
- Ad-free experience
- Data export (PDF/CSV)

See `PRODUCTION_READINESS_SUMMARY.md` for complete monetization roadmap.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass
- Code follows TypeScript/ESLint standards
- Security best practices are maintained

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase Genkit** - For the amazing AI framework
- **Google Gemini** - For powerful AI capabilities
- **TheMealDB** - For the comprehensive recipe database
- **USDA FoodData Central** - For nutritional data
- **Radix UI** - For accessible component primitives
- **Vercel** - For Next.js framework

---

## 📞 Support

- **Documentation**: See `PRODUCTION_CHECKLIST.md` and `SENTRY_SETUP.md`
- **Issues**: [GitHub Issues](https://github.com/Midoriya12/calsnap/issues)
- **Email**: support@calsnap.app (coming soon)

---

## 🔗 Links

- **Live Demo**: Coming soon
- **Documentation**: See `/docs` folder
- **API Docs**: See `API.md` (coming soon)

---

Made with ❤️ by the CalSnap Team

**Status**: 40% Production Ready | **Target Launch**: 3-4 weeks

See `PRODUCTION_READINESS_SUMMARY.md` for current status and roadmap.
