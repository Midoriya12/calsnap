
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/header';
import { ImageUploader } from '@/components/features/image-uploader';
import { NutritionalInfoDisplay } from '@/components/features/nutritional-info-display';
import { AdPlaceholder } from '@/components/ad-placeholder';
import type { AIEstimation } from '@/types';
import { Sparkles, Loader2, MailWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';

export default function CalSnapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [aiEstimation, setAiEstimation] = useState<AIEstimation | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | undefined>(undefined);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/');
      } else {
        // If user exists, proceed to render the page.
        // The email verification check will happen in the render logic.
        setIsLoadingPage(false);
      }
    }
  }, [user, authLoading, router]);


  const handleAnalysisComplete = (estimation: AIEstimation, imagePreview: string) => {
    setAiEstimation(estimation);
    setUploadedImagePreview(imagePreview);
  };

  const handleResendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        toast({
          title: "Verification Email Sent",
          description: "A new verification email has been sent. Please check your inbox (and spam folder).",
        });
      } catch (error: any) {
        console.error("Error resending verification email:", error);
        toast({
          title: "Error Sending Email",
          description: error.message || "Could not resend verification email. Please try again later.",
          variant: "destructive",
        });
      }
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
  
  // This case should ideally be caught by the useEffect redirect, but as a safeguard:
  if (!user) {
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

  // If user is logged in but email is not verified
  if (!user.emailVerified) {
    return (
      <div className="flex flex-col flex-grow">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-xl text-center">
            <CardHeader>
              <MailWarning className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Verify Your Email Address</CardTitle>
              <CardDescription>
                Your account is almost ready! Please verify your email address to access all features of CalSnap.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A verification link has been sent to <strong>{user.email}</strong>. Please check your inbox (and spam folder) and click the link to activate your account.
              </p>
              <Button onClick={handleResendVerificationEmail} className="w-full sm:w-auto">
                Resend Verification Email
              </Button>
            </CardContent>
            <CardFooter className="flex-col items-center justify-center pt-6 border-t mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                After verifying, you may need to refresh this page or log out and log back in.
              </p>
              <Button 
                variant="link" 
                onClick={async () => { 
                  await signOut(auth); 
                  // No explicit router.push('/login') needed here if AppHeader handles logout redirect correctly
                  // or if AuthProvider causes a re-render that leads to redirect by useEffect.
                  // Forcing refresh to ensure auth state propagates
                  router.refresh(); 
                }}
              >
                Log Out
              </Button>
            </CardFooter>
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
