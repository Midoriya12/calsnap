
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/header';
import { ImageUploader } from '@/components/features/image-uploader';
import { NutritionalInfoDisplay } from '@/components/features/nutritional-info-display';
import { AdPlaceholder } from '@/components/ad-placeholder';
import type { AIEstimation } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';

export default function CalSnapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [aiEstimation, setAiEstimation] = useState<AIEstimation | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | undefined>(undefined);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/');
      } else {
        setIsLoadingPage(false);
      }
    }
  }, [user, authLoading, router]);


  const handleAnalysisComplete = (estimation: AIEstimation, imagePreview: string) => {
    setAiEstimation(estimation);
    setUploadedImagePreview(imagePreview);
  };

  if (authLoading || isLoadingPage) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-background" suppressHydrationWarning={true}>
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
