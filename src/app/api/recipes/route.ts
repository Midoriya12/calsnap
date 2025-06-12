
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import type { Recipe } from '@/types';
import { mockRecipes } from '@/lib/mock-data'; // Import mockRecipes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('id');

  // Simulate a network delay - consider removing for production or making it conditional
  // await new Promise(resolve => setTimeout(resolve, 300));

  try {
    if (recipeId) {
      const recipe = mockRecipes.find(r => r.id === recipeId); // Find in mock data

      if (recipe) {
        return NextResponse.json<Recipe>(recipe, { status: 200 });
      } else {
        return NextResponse.json({ message: `Recipe with id ${recipeId} not found` }, { status: 404 });
      }
    } else {
      // Return all mock recipes if no ID is specified
      return NextResponse.json<Recipe[]>(mockRecipes, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to fetch recipes:", error); // Updated error message
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 });
  }
}

