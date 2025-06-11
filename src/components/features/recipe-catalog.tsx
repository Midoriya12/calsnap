
'use client';

import { useState, useEffect } from 'react';
import type { Recipe } from '@/types';
import { RecipeCard } from './recipe-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, ListFilter, Search, Loader2 } from 'lucide-react';
import { AdPlaceholder } from '../ad-placeholder';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function RecipeCatalog() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred while fetching recipes.");
        }
        console.error("Error fetching recipes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (recipe.ingredients || []).some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = cuisineFilter === 'all' || recipe.cuisine === cuisineFilter;
    const matchesDietary = dietaryFilter === 'all' || (recipe.dietaryRestrictions || []).includes(dietaryFilter);
    return matchesSearch && matchesCuisine && matchesDietary;
  });

  const cuisines = isLoading || error ? ['all'] : ['all', ...new Set(recipes.map(r => r.cuisine).filter(Boolean))];
  const dietaryOptions = isLoading || error ? ['all'] : ['all', ...new Set(recipes.flatMap(r => r.dietaryRestrictions).filter(Boolean))];


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline text-primary">
          <Utensils /> Recipe Catalog
        </CardTitle>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading || !!error}
              suppressHydrationWarning={true}
            />
          </div>
          <Select value={cuisineFilter} onValueChange={setCuisineFilter} disabled={isLoading || !!error} suppressHydrationWarning={true}>
            <SelectTrigger className="w-full md:w-[180px]" suppressHydrationWarning={true}>
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by cuisine" suppressHydrationWarning={true}/>
            </SelectTrigger>
            <SelectContent suppressHydrationWarning={true}>
              {cuisines.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine} suppressHydrationWarning={true}>{cuisine === 'all' ? 'All Cuisines' : cuisine}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dietaryFilter} onValueChange={setDietaryFilter} disabled={isLoading || !!error} suppressHydrationWarning={true}>
            <SelectTrigger className="w-full md:w-[180px]" suppressHydrationWarning={true}>
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by diet" suppressHydrationWarning={true}/>
            </SelectTrigger>
            <SelectContent suppressHydrationWarning={true}>
              {dietaryOptions.map(option => (
                <SelectItem key={option} value={option} suppressHydrationWarning={true}>{option === 'all' ? 'All Dietary Needs' : option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading recipes...</p>
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Error Fetching Recipes</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
        {!isLoading && !error && recipes.length > 0 && filteredRecipes.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No recipes found matching your criteria.</p>
        )}
        {!isLoading && !error && recipes.length === 0 && (
           <p className="text-center text-muted-foreground py-8">No recipes available at the moment. Please check back later.</p>
        )}
        <AdPlaceholder className="mt-8" />
      </CardContent>
    </Card>
  );
}
