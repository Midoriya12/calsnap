
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
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  source: string;
}
