
import { type NextRequest, NextResponse } from 'next/server';
import type { Recipe } from '@/types';

// Helper function to transform Spoonacular API response to our Recipe type
function transformSpoonacularRecipe(spoonacularRecipe: any): Recipe {
  const ingredients = spoonacularRecipe.extendedIngredients?.map((ing: any) => ing.original) || [];
  
  let instructions: string[] = [];
  if (spoonacularRecipe.analyzedInstructions && spoonacularRecipe.analyzedInstructions.length > 0) {
    spoonacularRecipe.analyzedInstructions.forEach((instrGroup: any) => {
      instrGroup.steps.forEach((step: any) => {
        instructions.push(step.step);
      });
    });
  } else if (spoonacularRecipe.instructions) { // Fallback for plain text instructions
    instructions = spoonacularRecipe.instructions.split('\n').filter((s: string) => s.trim() !== '');
  }

  const dietaryRestrictions: string[] = spoonacularRecipe.diets || [];
  if (spoonacularRecipe.vegetarian && !dietaryRestrictions.includes('Vegetarian')) dietaryRestrictions.push('Vegetarian');
  if (spoonacularRecipe.vegan && !dietaryRestrictions.includes('Vegan')) dietaryRestrictions.push('Vegan');
  if (spoonacularRecipe.glutenFree && !dietaryRestrictions.includes('Gluten-Free')) dietaryRestrictions.push('Gluten-Free');
  if (spoonacularRecipe.dairyFree && !dietaryRestrictions.includes('Dairy-Free')) dietaryRestrictions.push('Dairy-Free');

  let calories;
  if (spoonacularRecipe.nutrition?.nutrients) {
    const calNutrient = spoonacularRecipe.nutrition.nutrients.find((n: any) => n.name === 'Calories');
    if (calNutrient) calories = Math.round(calNutrient.amount);
  }
  
  // Basic HTML tag removal for summary/description
  const description = spoonacularRecipe.summary ? spoonacularRecipe.summary.replace(/<[^>]*>?/gm, '').substring(0, 250) + (spoonacularRecipe.summary.length > 250 ? '...' : '') : `A recipe for ${spoonacularRecipe.title}.`;

  return {
    id: spoonacularRecipe.id.toString(),
    name: spoonacularRecipe.title,
    imageUrl: spoonacularRecipe.image || 'https://placehold.co/600x400.png', // Fallback image
    cuisine: spoonacularRecipe.cuisines?.join(', ') || spoonacularRecipe.dishTypes?.join(', ') || 'General',
    ingredients,
    instructions,
    dietaryRestrictions: [...new Set(dietaryRestrictions)], // Remove duplicates
    calories,
    description,
    preparationTime: spoonacularRecipe.readyInMinutes ? `${spoonacularRecipe.readyInMinutes} minutes` : 'N/A',
    servings: spoonacularRecipe.servings || 0,
    sourceUrl: spoonacularRecipe.sourceUrl || spoonacularRecipe.spoonacularSourceUrl,
    viewCount: spoonacularRecipe.aggregateLikes || 0, // Using likes as a proxy for views
    saveCount: spoonacularRecipe.healthScore || 0, // Using health score as a proxy for saves
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('id');
  const searchTerm = searchParams.get('search');
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) {
    console.error("SPOONACULAR_API_KEY is not set in environment variables.");
    return NextResponse.json({ message: "Server configuration error: Missing Spoonacular API key." }, { status: 500 });
  }

  const SPOONACULAR_API_BASE = 'https://api.spoonacular.com/recipes';
  const defaultParams = `apiKey=${apiKey}&number=12&addRecipeInformation=true&fillIngredients=true`; // Fetch more info for list view

  try {
    let apiUrl = '';
    let isSearchById = false;

    if (recipeId) {
      apiUrl = `${SPOONACULAR_API_BASE}/${recipeId}/information?apiKey=${apiKey}&includeNutrition=true`;
      isSearchById = true;
    } else if (searchTerm) {
      apiUrl = `${SPOONACULAR_API_BASE}/complexSearch?query=${encodeURIComponent(searchTerm)}&${defaultParams}`;
    } else {
      // Default: fetch some popular/generic recipes (e.g., pasta)
      apiUrl = `${SPOONACULAR_API_BASE}/complexSearch?query=popular&${defaultParams}`;
    }

    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: `Spoonacular API error: ${response.status} ${response.statusText}`}));
      console.error(`Spoonacular API error: ${response.status}`, errorBody);
      return NextResponse.json({ message: errorBody.message || `Failed to fetch data from Spoonacular API. Status: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (isSearchById) {
      if (data) {
        const transformedRecipe = transformSpoonacularRecipe(data);
        return NextResponse.json<Recipe>(transformedRecipe, { status: 200 });
      } else {
        return NextResponse.json({ message: `Recipe with id ${recipeId} not found` }, { status: 404 });
      }
    } else { // Handles search and default list
      if (data.results && data.results.length > 0) {
        const transformedRecipes = data.results.map(transformSpoonacularRecipe);
        return NextResponse.json<Recipe[]>(transformedRecipes, { status: 200 });
      } else {
        return NextResponse.json<Recipe[]>([], { status: 200 }); // Return empty array for no results
      }
    }
  } catch (error) {
    console.error("Failed to fetch recipes from Spoonacular:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: `Failed to fetch recipes: ${message}` }, { status: 500 });
  }
}
