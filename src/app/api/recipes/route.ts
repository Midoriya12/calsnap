
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
  
  const dietaryRestrictions = meal.strTags 
    ? meal.strTags.split(',').map((tag: string) => tag.trim()) 
    : [];
  if (meal.strCategory && !dietaryRestrictions.includes(meal.strCategory)) {
    // dietaryRestrictions.push(meal.strCategory); // Optionally add category as a tag
  }


  return {
    id: meal.idMeal,
    name: meal.strMeal,
    imageUrl: meal.strMealThumb,
    cuisine: meal.strArea || meal.strCategory || 'Unknown',
    ingredients,
    instructions,
    dietaryRestrictions,
    calories: undefined, // TheMealDB does not provide this
    description: meal.strInstructions ? meal.strInstructions.substring(0, 150) + (meal.strInstructions.length > 150 ? '...' : '') : `A delicious ${meal.strMeal} dish.`,
    preparationTime: 'N/A', // TheMealDB does not provide this
    servings: 'N/A', // TheMealDB does not provide this
    youtubeUrl: meal.strYoutube,
    sourceUrl: meal.strSource,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('id');
  const searchTerm = searchParams.get('search');
  const listByLetter = searchParams.get('letter') || 'b'; // Default to letter 'b' for a general list

  const THEMEALDB_API_BASE = 'https://www.themealdb.com/api/json/v1/1';

  try {
    let apiUrl = '';
    if (recipeId) {
      apiUrl = `${THEMEALDB_API_BASE}/lookup.php?i=${recipeId}`;
    } else if (searchTerm) {
      apiUrl = `${THEMEALDB_API_BASE}/search.php?s=${encodeURIComponent(searchTerm)}`;
    } else {
      apiUrl = `${THEMEALDB_API_BASE}/search.php?f=${listByLetter}`; // Fetch by first letter for catalog
    }

    const response = await fetch(apiUrl, { cache: 'no-store' }); // Disable caching for fresh data
    if (!response.ok) {
      console.error(`TheMealDB API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("TheMealDB API error body:", errorBody);
      return NextResponse.json({ message: `Failed to fetch data from TheMealDB API. Status: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (recipeId) {
      if (data.meals && data.meals.length > 0) {
        const transformedRecipe = transformMealDBRecipe(data.meals[0]);
        return NextResponse.json<Recipe>(transformedRecipe, { status: 200 });
      } else {
        return NextResponse.json({ message: `Recipe with id ${recipeId} not found` }, { status: 404 });
      }
    } else { // Handles both search and list by letter
      if (data.meals) {
        const transformedRecipes = data.meals.map(transformMealDBRecipe);
        return NextResponse.json<Recipe[]>(transformedRecipes, { status: 200 });
      } else {
        // For search, "null" meals means no results. For letter, it might also mean no results.
        return NextResponse.json<Recipe[]>([], { status: 200 }); // Return empty array for no results
      }
    }
  } catch (error) {
    console.error("Failed to fetch recipes from TheMealDB:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: `Failed to fetch recipes: ${message}` }, { status: 500 });
  }
}
