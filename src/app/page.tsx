
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/header';
import { ImageUploader } from '@/components/features/image-uploader';
import { NutritionalInfoDisplay } from '@/components/features/nutritional-info-display';
import { AdPlaceholder } from '@/components/ad-placeholder';
import type { AIEstimation } from '@/types';
import { Sparkles, Loader2, MailWarning, Send, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';

export default function CalSnapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [aiEstimation, setAiEstimation] = useState<AIEstimation | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | undefined>(undefined);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/');
      } else {
        // User is loaded, page content (either main app or verification prompt)
        // will be determined by user.emailVerified in the render logic.
        setIsLoadingPage(false);
      }
    }
  }, [user, authLoading, router]);

  const handleAnalysisComplete = (estimation: AIEstimation, imagePreview: string) => {
    setAiEstimation(estimation);
    setUploadedImagePreview(imagePreview);
  };

  const handleResendVerificationEmail = async () => {
    if (!user) return;
    setIsResendingEmail(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification Email Sent',
        description: 'A new verification email has been sent. Please check your inbox (and spam folder).',
      });
    } catch (error: any) {
      toast({
        title: 'Error Sending Email',
        description: error.message || 'Could not resend verification email.',
        variant: 'destructive',
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login'); // Redirect to login after logout
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message || 'Could not log out. Please try again.',
        variant: 'destructive',
      });
    }
  };


  if (authLoading || isLoadingPage) {
    return (
      <div className="flex flex-col flex-grow">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) { // Should be caught by the useEffect redirect, but as a safeguard
    return (
      <div className="flex flex-col flex-grow">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Mandatory Email Verification Check
  if (!user.emailVerified) {
    return (
      <div className="flex flex-col flex-grow" suppressHydrationWarning={true}>
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader className="text-center">
              <MailWarning className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Verify Your Email Address</CardTitle>
              <CardDescription>
                To access CalSnap, please verify your email address. We've sent a verification link to <strong>{user.email}</strong>.
                Please check your inbox (and spam/junk folder).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleResendVerificationEmail} className="w-full" disabled={isResendingEmail}>
                {isResendingEmail ? <Loader2 className="animate-spin" /> : <Send className="mr-2" />}
                Resend Verification Email
              </Button>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </main>
        <footer className="text-center text-muted-foreground text-sm py-8 border-t">
          <p>&copy; {new Date().getFullYear()} CalSnap. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // If user is logged in AND email is verified, show the main page content
  return (
    <div className="flex flex-col flex-grow" suppressHydrationWarning={true}>
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <section id="ai-analyzer" aria-labelledby="ai-analyzer-heading">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
              <ImageUploader onAnalysisComplete={handleAnalysisComplete} />
              <AdPlaceholder />
            </div>
            {aiEstimation && uploadedImagePreview && (
              <div className="lg:col-span-2">
                <NutritionalInfoDisplay estimation={aiEstimation} uploadedImage={uploadedImagePreview} />
              </div>
            )}
            {!aiEstimation && (
              <div className="lg:col-span-2 flex flex-col items-center justify-center h-full bg-card rounded-lg p-8 shadow-md border border-dashed">
                <Sparkles className="h-16 w-16 text-primary mb-6" />
                <h2 id="ai-analyzer-heading" className="text-2xl font-semibold text-foreground mb-3">Welcome to CalSnap!</h2>
                <p className="text-muted-foreground text-center mb-1">
                  Ready to discover the secrets of your meal?
                </p>
                <p className="text-muted-foreground text-center">
                  Upload a photo, and our AI will estimate its calories,
                  identify ingredients, and even suggest a detailed recipe.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="text-center text-muted-foreground text-sm py-8 border-t">
        <p>&copy; {new Date().getFullYear()} CalSnap. All rights reserved.</p>
        <p>Meal data is AI-estimated and for informational purposes only. Consult a nutritionist for dietary advice.</p>
      </footer>
    </div>
  );
}
