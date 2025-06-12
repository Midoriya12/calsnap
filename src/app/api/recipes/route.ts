
import { type NextRequest, NextResponse } from 'next/server';
import type { Recipe } from '@/types';

// Helper function to transform TheMealDB API response to our Recipe type
function transformMealDBRecipe(meal: any): Recipe {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
    }
  }

  const instructions = meal.strInstructions
    ? meal.strInstructions.split('\n').map((s: string) => s.trim()).filter((s: string) => s !== '')
    : [];
  
  const dietaryRestrictions: string[] = meal.strTags ? meal.strTags.split(',').map((tag: string) => tag.trim()) : [];
  if (meal.strCategory && !dietaryRestrictions.includes(meal.strCategory)) {
    // dietaryRestrictions.push(meal.strCategory); // Optionally add category as a dietary tag
  }


  return {
    id: meal.idMeal,
    name: meal.strMeal,
    imageUrl: meal.strMealThumb || 'https://placehold.co/600x400.png',
    cuisine: meal.strArea || 'General',
    ingredients,
    instructions,
    dietaryRestrictions,
    // calories: undefined, // Not provided by TheMealDB
    description: `A recipe for ${meal.strMeal}. ${meal.strInstructions ? meal.strInstructions.substring(0, 100) + '...' : ''}`,
    preparationTime: 'N/A',
    servings: 'N/A', 
    youtubeUrl: meal.strYoutube,
    sourceUrl: meal.strSource,
    viewCount: 0, // Not available from TheMealDB
    saveCount: 0, // Not available from TheMealDB
  };
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('id');
  const searchTerm = searchParams.get('search');
  // TheMealDB does not require an API key for public access.

  const MEALDB_API_BASE = 'https://www.themealdb.com/api/json/v1/1';

  try {
    let apiUrl = '';
    let isSearchById = false;

    if (recipeId) {
      apiUrl = `${MEALDB_API_BASE}/lookup.php?i=${recipeId}`;
      isSearchById = true;
    } else if (searchTerm) {
      apiUrl = `${MEALDB_API_BASE}/search.php?s=${encodeURIComponent(searchTerm)}`;
    } else {
      // Default: fetch some recipes (e.g., by first letter 'b')
      apiUrl = `${MEALDB_API_BASE}/search.php?f=b`;
    }

    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`TheMealDB API error: ${response.status} ${response.statusText}`, errorBody);
        return NextResponse.json({ message: `Failed to fetch data from TheMealDB API. Status: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (isSearchById) {
      if (data.meals && data.meals.length > 0) {
        const transformedRecipe = transformMealDBRecipe(data.meals[0]);
        return NextResponse.json<Recipe>(transformedRecipe, { status: 200 });
      } else {
        return NextResponse.json({ message: `Recipe with id ${recipeId} not found` }, { status: 404 });
      }
    } else { // Handles search and default list
      if (data.meals && data.meals.length > 0) {
        const transformedRecipes = data.meals.map(transformMealDBRecipe);
        return NextResponse.json<Recipe[]>(transformedRecipes, { status: 200 });
      } else {
        return NextResponse.json<Recipe[]>([], { status: 200 }); // Return empty array for no results
      }
    }
  } catch (error) {
    console.error("Failed to fetch recipes from TheMealDB:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: `Failed to fetch recipes: ${message}` }, { status: 500 });
  }
}
