'use client';

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2, Sparkles } from 'lucide-react';
import { guessCaloriesFromImage, type GuessCaloriesFromImageOutput } from '@/ai/flows/guess-calories-from-image';
import { detectIngredientsFromImage, type DetectIngredientsFromImageOutput } from '@/ai/flows/detect-ingredients-from-image';
import type { AIEstimation } from '@/types';


interface ImageUploaderProps {
  onAnalysisComplete: (estimation: AIEstimation, imagePreview: string) => void;
}

export function ImageUploader({ onAnalysisComplete }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        setFile(null);
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !imagePreview) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Ensure imagePreview is a string and contains the base64 prefix
      if (typeof imagePreview !== 'string' || !imagePreview.startsWith('data:image')) {
        throw new Error('Invalid image data URI format.');
      }
      
      const [caloriesResult, ingredientsResult] = await Promise.all([
        guessCaloriesFromImage({ photoDataUri: imagePreview }),
        detectIngredientsFromImage({ photoDataUri: imagePreview })
      ]);

      const estimation: AIEstimation = {
        estimatedCalories: caloriesResult.estimatedCalories,
        // If guessCaloriesFromImage also returns ingredients, prioritize that, else use detectIngredientsFromImage
        ingredients: caloriesResult.ingredients && caloriesResult.ingredients.length > 0 ? caloriesResult.ingredients : ingredientsResult.ingredients,
      };
      
      onAnalysisComplete(estimation, imagePreview);
      toast({
        title: "Analysis Complete!",
        description: "Calories and ingredients have been estimated.",
      });

    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline text-primary">
            <Sparkles /> AI Meal Analyzer
        </CardTitle>
        <CardDescription>Upload a photo of your meal to get an estimate of its calories and ingredients.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="meal-image" className="block text-sm font-medium text-foreground">
              Upload Meal Photo
            </label>
            <Input
              id="meal-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:text-primary file:font-semibold"
              disabled={isLoading}
            />
          </div>

          {imagePreview && (
            <div className="mt-4 border border-dashed border-border rounded-lg p-4 flex justify-center items-center bg-muted/50">
              <Image src={imagePreview} alt="Meal preview" width={300} height={200} className="rounded-md object-contain max-h-60" data-ai-hint="food meal" />
            </div>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !file}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            Analyze Meal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
