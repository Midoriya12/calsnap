
'use client';

import type { AIEstimation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Info, ListTree, Utensils, Lightbulb, ClipboardList, Zap } from 'lucide-react';

interface NutritionalInfoDisplayProps {
  estimation: AIEstimation | null;
  uploadedImage?: string;
}

export function NutritionalInfoDisplay({ estimation, uploadedImage }: NutritionalInfoDisplayProps) {
  if (!estimation) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline text-primary">
          <Zap /> AI Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadedImage && (
          <div className="mb-4">
            <img src={uploadedImage} alt="Uploaded meal" className="rounded-lg max-h-64 w-full object-contain" data-ai-hint="food meal" />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Utensils className="text-accent" /> Identified Dish</h3>
          <p className="text-md font-medium text-foreground">{estimation.dishName || "N/A"}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Info className="text-accent" /> Estimated Calories</h3>
          <Badge variant="secondary" className="text-lg px-3 py-1 bg-accent/20 text-accent-foreground">
            {estimation.estimatedCalories} kcal
          </Badge>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ListTree className="text-accent"/> Key Ingredients</h3>
          {estimation.ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {estimation.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {ingredient}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specific ingredients readily identifiable.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-accent" /> AI Recipe Idea</h3>
          <p className="text-sm text-foreground/90 whitespace-pre-line">
            {estimation.recipeIdea || "No specific recipe idea generated for this image."}
          </p>
        </div>
        
        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ClipboardList className="text-accent" /> Nutritional Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Enhanced nutritional breakdown (macros, micros) powered by USDA FoodData Central API is on its way!
          </p>
        </div>

      </CardContent>
      <CardFooter className="flex-col items-start space-y-3 pt-4">
          <h3 className="text-md font-semibold mb-1">One-Click Ingredient Ordering</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Order ingredients for this meal (or similar) from your favorite services. (Feature coming soon)
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" disabled>
              <ShoppingCart className="mr-2 h-4 w-4" /> Order from Zepto
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ShoppingCart className="mr-2 h-4 w-4" /> Order from Blinkit
            </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
