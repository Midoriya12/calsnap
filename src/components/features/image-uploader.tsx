
'use client';

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { guessCaloriesFromImage } from '@/ai/flows/guess-calories-from-image';
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
      if (typeof imagePreview !== 'string' || !imagePreview.startsWith('data:image')) {
        throw new Error('Invalid image data URI format.');
      }
      
      const analysisResult = await guessCaloriesFromImage({ photoDataUri: imagePreview });

      const estimation: AIEstimation = {
        dishName: analysisResult.dishName,
        estimatedCalories: analysisResult.estimatedCalories,
        identifiedIngredients: analysisResult.identifiedIngredients,
        generatedRecipe: analysisResult.generatedRecipe,
      };
      
      onAnalysisComplete(estimation, imagePreview);
      toast({
        title: "Analysis Complete!",
        description: "Dish name, calories, ingredients, and a full recipe have been generated.",
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline text-primary">
            <Sparkles /> AI Meal Analyzer
        </CardTitle>
        <CardDescription>Upload a photo of your meal to get its calorie estimate, ingredients, and a full recipe.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={triggerFileInput}
              disabled={isLoading}
              suppressHydrationWarning={true}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {file ? "Change Meal Photo" : "Upload Meal Photo"}
            </Button>
            <Input
              id="meal-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="sr-only" 
              disabled={isLoading}
              suppressHydrationWarning={true}
            />
             {file && <p className="text-sm text-muted-foreground text-center pt-1">Selected: {file.name}</p>}
          </div>

          {imagePreview && (
            <div className="mt-4 border border-dashed border-border rounded-lg p-4 flex justify-center items-center bg-muted/50">
              <Image src={imagePreview} alt="Meal preview" width={300} height={200} className="rounded-md object-contain max-h-60" data-ai-hint="food meal"/>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !file} suppressHydrationWarning={true}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ChefHat className="mr-2 h-4 w-4" />
            )}
            Analyze Meal & Get Full Recipe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
