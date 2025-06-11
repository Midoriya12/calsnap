'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/header';
import { ImageUploader } from '@/components/features/image-uploader';
import { NutritionalInfoDisplay } from '@/components/features/nutritional-info-display';
import { RecipeCatalog } from '@/components/features/recipe-catalog';
import { AdPlaceholder } from '@/components/ad-placeholder';
import type { AIEstimation } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function CalSnapPage() {
  const [aiEstimation, setAiEstimation] = useState<AIEstimation | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | undefined>(undefined);

  const handleAnalysisComplete = (estimation: AIEstimation, imagePreview: string) => {
    setAiEstimation(estimation);
    setUploadedImagePreview(imagePreview);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <section id="ai-analyzer" aria-labelledby="ai-analyzer-heading">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
              <ImageUploader onAnalysisComplete={handleAnalysisComplete} />
              <AdPlaceholder />
            </div>
            {aiEstimation && (
              <div className="lg:col-span-2">
                <NutritionalInfoDisplay estimation={aiEstimation} uploadedImage={uploadedImagePreview} />
              </div>
            )}
             {!aiEstimation && (
                <div className="lg:col-span-2 flex items-center justify-center h-full bg-card rounded-lg p-8">
                    <p className="text-muted-foreground text-center">Upload an image of your meal to see its nutritional analysis here.</p>
                </div>
            )}
          </div>
        </section>

        <Separator className="my-12" />

        <section id="recipe-catalog" aria-labelledby="recipe-catalog-heading">
          <RecipeCatalog />
        </section>

        <footer className="text-center text-muted-foreground text-sm py-8">
          <p>&copy; {new Date().getFullYear()} CalSnap. All rights reserved.</p>
          <p>Meal data is AI-estimated and for informational purposes only. Consult a nutritionist for dietary advice.</p>
        </footer>
      </main>
    </div>
  );
}
