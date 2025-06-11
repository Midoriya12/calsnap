
'use client';

import type { AIEstimation, IngredientNutritionInfo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Info, ListTree, Utensils, Lightbulb, ClipboardList, Zap, Loader2, AlertCircle, Clock, Users, ChefHat, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';


interface NutritionalInfoDisplayProps {
  estimation: AIEstimation | null;
  uploadedImage?: string;
}

export function NutritionalInfoDisplay({ estimation, uploadedImage }: NutritionalInfoDisplayProps) {
  const [selectedIngredientNutrition, setSelectedIngredientNutrition] = useState<IngredientNutritionInfo | null>(null);
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);

  if (!estimation) {
    return null;
  }

  const handleIngredientClick = async (ingredientName: string) => {
    setIsLoadingNutrition(true);
    setNutritionError(null);
    setSelectedIngredientNutrition(null); 
    try {
      const response = await fetch(`/api/nutrition?ingredientName=${encodeURIComponent(ingredientName)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to fetch nutritional data. Status: ${response.status}` }));
        throw new Error(errorData.message || `Failed to fetch nutritional data. Status: ${response.status}`);
      }
      const data: IngredientNutritionInfo = await response.json();
      setSelectedIngredientNutrition(data);
    } catch (error) {
      console.error("Error fetching ingredient nutrition:", error);
      if (error instanceof Error) {
        setNutritionError(error.message);
      } else {
        setNutritionError("An unknown error occurred while fetching nutritional data.");
      }
    } finally {
      setIsLoadingNutrition(false);
    }
  };

  const { 
    dishName, 
    estimatedCalories, 
    identifiedIngredients, 
    generatedRecipe 
  } = estimation;

  // Default to empty arrays if properties are undefined
  const currentIdentifiedIngredients = identifiedIngredients || [];
  
  const currentGeneratedRecipe = generatedRecipe || { 
    name: 'Recipe Details Unavailable', 
    description: 'The AI could not generate a detailed recipe at this time.', 
    preparationTime: 'N/A', 
    cookingTime: 'N/A', 
    servings: 'N/A', 
    ingredientsList: [], 
    instructionsList: [] 
  };
  
  const currentRecipeIngredientsList = currentGeneratedRecipe.ingredientsList || [];
  const currentRecipeInstructionsList = currentGeneratedRecipe.instructionsList || [];

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
            <img src={uploadedImage} alt="Uploaded meal" className="rounded-lg max-h-64 w-full object-contain" data-ai-hint="food meal"/>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Utensils className="text-accent" /> Identified Dish</h3>
          <p className="text-md font-medium text-foreground">{dishName || "N/A"}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Info className="text-accent" /> Estimated Calories (Whole Meal)</h3>
          <Badge variant="secondary" className="text-lg px-3 py-1 bg-accent/20 text-accent-foreground">
            {estimatedCalories || 0} kcal
          </Badge>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ListTree className="text-accent"/> Key Ingredients (Identified in Photo)</h3>
          <p className="text-xs text-muted-foreground mb-2">Click an ingredient to see nutritional details from USDA.</p>
          {currentIdentifiedIngredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentIdentifiedIngredients.map((ingredient, index) => (
                <Badge
                  key={`${ingredient}-${index}`} 
                  variant="outline"
                  className="text-sm cursor-pointer hover:bg-accent/10 active:bg-accent/20"
                  onClick={() => handleIngredientClick(ingredient)}
                  tabIndex={0} 
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleIngredientClick(ingredient);}} 
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specific ingredients readily identifiable in the photo.</p>
          )}
        </div>
        
        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ClipboardList className="text-accent" /> Nutritional Dashboard (Per Ingredient - USDA Data)
          </h3>
          {isLoadingNutrition && (
             <Card className="mt-2 bg-muted/50 p-4 animate-pulse">
                <Skeleton className="h-5 w-1/2 mb-3" /> 
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" /> 
                  <Skeleton className="h-4 w-full" /> 
                  <Skeleton className="h-4 w-2/3" /> 
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3 mt-1" />
                </div>
              </Card>
          )}
          {!isLoadingNutrition && nutritionError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Details</AlertTitle>
              <AlertDescription>{nutritionError}</AlertDescription>
            </Alert>
          )}
          {!isLoadingNutrition && !nutritionError && selectedIngredientNutrition && (
            <Card className="mt-2 bg-muted/50 p-4">
              <CardTitle className="text-md mb-2">Details for: <span className="font-bold text-primary">{selectedIngredientNutrition.ingredient}</span></CardTitle>
              <ul className="text-sm space-y-1">
                <li><strong>Calories:</strong> {selectedIngredientNutrition.calories} kcal</li>
                <li><strong>Protein:</strong> {selectedIngredientNutrition.protein}</li>
                <li><strong>Fat:</strong> {selectedIngredientNutrition.fat}</li>
                <li><strong>Carbs:</strong> {selectedIngredientNutrition.carbs}</li>
                <li className="text-xs text-muted-foreground pt-1"><em>Source: {selectedIngredientNutrition.source}</em></li>
              </ul>
            </Card>
          )}
          {!isLoadingNutrition && !nutritionError && !selectedIngredientNutrition && (
            <p className="text-sm text-muted-foreground mt-2">
              Select an ingredient identified in the photo to view its nutritional details here.
            </p>
          )}
        </div>

        <Separator />
        
        <div>
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-primary"><BookOpen /> AI Generated Recipe: {currentGeneratedRecipe.name}</h3>
          
          <p className="text-md text-muted-foreground mb-4">{currentGeneratedRecipe.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
              <Clock size={20} className="text-accent mb-1" />
              <span className="font-semibold">Prep Time</span>
              <span>{currentGeneratedRecipe.preparationTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
              <ChefHat size={20} className="text-accent mb-1" />
              <span className="font-semibold">Cook Time</span>
              <span>{currentGeneratedRecipe.cookingTime}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
              <Users size={20} className="text-accent mb-1" />
              <span className="font-semibold">Servings</span>
              <span>{currentGeneratedRecipe.servings}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
              <ListChecks /> Recipe Ingredients
            </h4>
            {currentRecipeIngredientsList.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 pl-4 text-foreground/90">
                {currentRecipeIngredientsList.map((ingredient, index) => (
                  <li key={`recipe-ing-${index}`}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No ingredients listed for this recipe by the AI.</p>
            )}
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
              <ListChecks /> Recipe Instructions
            </h4>
            {currentRecipeInstructionsList.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2 pl-4 text-foreground/90">
                {currentRecipeInstructionsList.map((step, index) => (
                  <li key={`recipe-instr-${index}`}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No instructions provided for this recipe by the AI.</p>
            )}
          </div>
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
