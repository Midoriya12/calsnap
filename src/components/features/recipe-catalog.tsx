'use client';

import { useState } from 'react';
import type { Recipe } from '@/types';
import { mockRecipes } from '@/lib/mock-data';
import { RecipeCard } from './recipe-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, ListFilter, Search } from 'lucide-react';
import { AdPlaceholder } from '../ad-placeholder';

export function RecipeCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = cuisineFilter === 'all' || recipe.cuisine === cuisineFilter;
    const matchesDietary = dietaryFilter === 'all' || recipe.dietaryRestrictions.includes(dietaryFilter);
    return matchesSearch && matchesCuisine && matchesDietary;
  });

  const cuisines = ['all', ...new Set(mockRecipes.map(r => r.cuisine))];
  const dietaryOptions = ['all', ...new Set(mockRecipes.flatMap(r => r.dietaryRestrictions))];


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
            />
          </div>
          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisines.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine}>{cuisine === 'all' ? 'All Cuisines' : cuisine}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by diet" />
            </SelectTrigger>
            <SelectContent>
              {dietaryOptions.map(option => (
                <SelectItem key={option} value={option}>{option === 'all' ? 'All Dietary Needs' : option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No recipes found matching your criteria.</p>
        )}
        <AdPlaceholder className="mt-8" />
      </CardContent>
    </Card>
  );
}
