
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { ChatbotFab } from '@/components/features/chatbot-fab'; // Import Chatbot FAB

export const metadata: Metadata = {
  title: 'CalSnap App',
  description: 'Estimate calories and detect ingredients from your meal photos.',
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
