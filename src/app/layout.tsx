
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { ChatbotFab } from '@/components/features/chatbot-fab'; // Import Chatbot FAB

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'CalSnap - AI-Powered Meal Tracking & Nutrition App',
    template: '%s | CalSnap',
  },
  description:
    'Snap your meals, track your nutrition, discover recipes - all powered by AI. Get instant calorie estimates, ingredient detection, and personalized meal planning with CalSnap.',
  keywords: [
    'meal tracking',
    'nutrition app',
    'calorie counter',
    'AI food recognition',
    'recipe finder',
    'diet tracker',
    'macro tracker',
    'food diary',
    'meal planner',
    'healthy eating',
  ],
  authors: [{ name: 'CalSnap Team' }],
  creator: 'CalSnap',
  publisher: 'CalSnap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'CalSnap',
    title: 'CalSnap - AI-Powered Meal Tracking & Nutrition App',
    description:
      'Snap your meals, track your nutrition, discover recipes - all powered by AI. Get instant calorie estimates and personalized meal planning.',
    images: [
      {
        url: '/og-image.png', // We'll create this later
        width: 1200,
        height: 630,
        alt: 'CalSnap - AI-Powered Meal Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalSnap - AI-Powered Meal Tracking',
    description:
      'Snap your meals, track your nutrition, discover recipes - all powered by AI.',
    images: ['/og-image.png'],
    creator: '@calsnap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster />
          <ChatbotFab /> {/* Add Chatbot FAB here */}
        </AuthProvider>
      </body>
    </html>
  );
}
