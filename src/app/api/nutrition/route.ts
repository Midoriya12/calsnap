
import { type NextRequest, NextResponse } from 'next/server';

interface UsdaNutrient {
  nutrientId: number;
  nutrientName: string;
  unitName: string;
  value: number;
}

interface UsdaFoodItem {
  fdcId: number;
  description: string;
  foodNutrients: UsdaNutrient[];
}

interface UsdaApiResponse {
  foods: UsdaFoodItem[];
  totalHits: number;
}

// Helper function to find a nutrient by its common name part
const findNutrientValue = (nutrients: UsdaNutrient[], namePart: string, fallbackId?: number): string => {
  let nutrient = nutrients.find(n => n.nutrientName.toLowerCase().includes(namePart.toLowerCase()));
  if (!nutrient && fallbackId) {
    nutrient = nutrients.find(n => n.nutrientId === fallbackId);
  }
  return nutrient ? `${nutrient.value}${nutrient.unitName.toLowerCase()}` : 'N/A';
};


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ingredientName = searchParams.get('ingredientName');
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    console.error("USDA_API_KEY is not set in environment variables.");
    return NextResponse.json({ message: "Server configuration error: Missing API key." }, { status: 500 });
  }

  if (!ingredientName) {
    return NextResponse.json({ message: "Missing ingredientName query parameter" }, { status: 400 });
  }

  const usdaApiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(ingredientName)}&pageSize=1&dataType=Foundation,SR%20Legacy`;

  try {
    const response = await fetch(usdaApiUrl);
    if (!response.ok) {
      console.error(`USDA API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("USDA API error body:", errorBody);
      return NextResponse.json({ message: `Failed to fetch data from USDA API. Status: ${response.status}` }, { status: response.status });
    }

    const data: UsdaApiResponse = await response.json();

    if (!data.foods || data.foods.length === 0) {
      return NextResponse.json({ message: `No nutritional data found for "${ingredientName}"` }, { status: 404 });
    }

    const foodItem = data.foods[0];
    const nutrients = foodItem.foodNutrients;

    // Standard nutrient IDs (from USDA documentation):
    // Energy (kcal): 208 (or 1008 in older datasets) -> "Energy"
    // Protein: 203 -> "Protein"
    // Total lipid (fat): 204 -> "Total lipid (fat)"
    // Carbohydrate, by difference: 205 -> "Carbohydrate, by difference"

    const nutritionData = {
      ingredient: foodItem.description, // Use the description from USDA for accuracy
      calories: parseFloat(findNutrientValue(nutrients, 'energy', 208).replace(/[^\d.-]/g, '')) || 0, // Extract numeric value for calories
      protein: findNutrientValue(nutrients, 'protein', 203),
      fat: findNutrientValue(nutrients, 'total lipid (fat)', 204),
      carbs: findNutrientValue(nutrients, 'carbohydrate, by difference', 205),
      source: "USDA FoodData Central API (per 100g)",
    };

    return NextResponse.json(nutritionData, { status: 200 });

  } catch (error) {
    console.error(`Failed to fetch nutrition data for ${ingredientName}:`, error);
    return NextResponse.json({ message: `An unexpected error occurred while fetching nutrition data for ${ingredientName}` }, { status: 500 });
  }
}
