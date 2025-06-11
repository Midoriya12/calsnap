
'use client';

import Image from 'next/image';
import type { Recipe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Clock, Users, Flame, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { toast } = useToast();

  const handleRecipeClick = () => {
    toast({
      title: `Viewing: ${recipe.name}`,
      description: "Full recipe details coming soon!",
    });
    // In a real app, you would navigate to a recipe details page or open a modal here.
    console.log("Clicked on recipe:", recipe.name, recipe.id);
  };

  return (
    <div onClick={handleRecipeClick} className="cursor-pointer h-full">
      <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image 
              src={recipe.imageUrl} 
              alt={recipe.name} 
              layout="fill" 
              objectFit="cover" 
              className="rounded-t-lg"
              data-ai-hint={`${recipe.cuisine} food`}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1 text-primary">{recipe.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mb-2">{recipe.cuisine}</CardDescription>
          <p className="text-sm mb-3 text-foreground/80 line-clamp-3">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.dietaryRestrictions.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{recipe.preparationTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>Serves {recipe.servings}</span>
            </div>
            {recipe.calories && (
              <div className="flex items-center gap-1">
                <Flame size={14} className="text-accent" />
                <span>{recipe.calories} kcal per serving</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); handleRecipeClick(); }}>
            <Eye className="mr-2 h-4 w-4" />
            View Recipe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
