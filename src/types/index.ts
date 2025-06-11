
export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string;
  ingredients: string[];
  dietaryRestrictions: string[];
  calories?: number;
  description: string;
  preparationTime: string;
  servings: number;
}

export interface AIEstimation {
  dishName: string;
  estimatedCalories: number;
  ingredients: string[];
  recipeIdea: string;
}

export interface IngredientNutritionInfo {
  ingredient: string;
  calories: number; // Storing as number for potential calculations
  protein: string; // e.g., "10g"
  fat: string;     // e.g., "5g"
  carbs: string;   // e.g., "20g"
  source: string;
}
