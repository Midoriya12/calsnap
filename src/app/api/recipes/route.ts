
import { type NextRequest, NextResponse } from 'next/server';
import { mockRecipes } from '@/lib/mock-data';
import type { Recipe } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('id');

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    if (recipeId) {
      const recipe = mockRecipes.find(r => r.id === recipeId);
      if (recipe) {
        return NextResponse.json<Recipe>(recipe, { status: 200 });
      } else {
        return NextResponse.json({ message: `Recipe with id ${recipeId} not found` }, { status: 404 });
      }
    } else {
      // Return all recipes if no ID is specified
      return NextResponse.json<Recipe[]>(mockRecipes, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 });
  }
}
