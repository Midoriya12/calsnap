
import { NextResponse } from 'next/server';
import { mockRecipes } from '@/lib/mock-data';
import type { Recipe } from '@/types';

export async function GET() {
  // In a real application, you would fetch this data from a database.
  try {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json<Recipe[]>(mockRecipes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 });
  }
}
