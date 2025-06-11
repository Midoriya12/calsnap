
export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  dietaryRestrictions: string[];
  calories?: number;
  description: string;
  preparationTime: string;
  servings: number;
}

export interface DetailedRecipe {
  name: string;
  description: string;
  preparationTime: string;
  cookingTime: string;
  servings: string;
  ingredientsList: string[];
  instructionsList: string[];
}

export interface AIEstimation {
  dishName: string;
  estimatedCalories: number;
  identifiedIngredients: string[]; // Renamed from 'ingredients'
  generatedRecipe: DetailedRecipe;
}

export interface IngredientNutritionInfo {
  ingredient: string;
  calories: number; 
  protein: string; 
  fat: string;     
  carbs: string;   
  source: string;
}
