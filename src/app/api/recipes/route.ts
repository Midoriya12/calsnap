
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import type { Recipe } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('id');

  // Simulate a network delay - consider removing for production or making it conditional
  // await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const recipesCollectionRef = collection(db, 'recipes');

    if (recipeId) {
      const recipeDocRef = doc(recipesCollectionRef, recipeId);
      const recipeSnapshot = await getDoc(recipeDocRef);

      if (recipeSnapshot.exists()) {
        const recipeData = recipeSnapshot.data() as Omit<Recipe, 'id'>;
        const recipe: Recipe = { id: recipeSnapshot.id, ...recipeData };
        return NextResponse.json<Recipe>(recipe, { status: 200 });
      } else {
        return NextResponse.json({ message: `Recipe with id ${recipeId} not found` }, { status: 404 });
      }
    } else {
      // Return all recipes if no ID is specified
      // Consider adding pagination for production if you have many recipes
      const querySnapshot = await getDocs(recipesCollectionRef);
      const recipes = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data() as Omit<Recipe, 'id'>;
        return { id: docSnapshot.id, ...data } as Recipe;
      });
      return NextResponse.json<Recipe[]>(recipes, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to fetch recipes from Firestore:", error);
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 });
  }
}
