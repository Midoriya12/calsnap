
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ingredientName = searchParams.get('ingredientName');

  if (!ingredientName) {
    return NextResponse.json({ message: "Missing ingredientName query parameter" }, { status: 400 });
  }

  // In a real application, you would fetch data from the USDA API here.
  // For now, return a mock response.
  try {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockNutritionData = {
      ingredient: ingredientName,
      calories: Math.floor(Math.random() * 100 + 50), // Random calories for demo
      protein: `${Math.floor(Math.random() * 10 + 5)}g`,
      fat: `${Math.floor(Math.random() * 5 + 2)}g`,
      carbs: `${Math.floor(Math.random() * 15 + 1)}g`,
      source: "Mock USDA Data (Placeholder)",
    };
    return NextResponse.json(mockNutritionData, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch nutrition data for ${ingredientName}:`, error);
    return NextResponse.json({ message: `Failed to fetch nutrition data for ${ingredientName}` }, { status: 500 });
  }
}
