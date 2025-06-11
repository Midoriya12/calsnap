
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
  identifiedIngredients: string[];
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

export interface SavedMeal {
  id: string; // Unique ID for the saved meal, can be a timestamp or UUID
  uploadedImagePreview: string; // Data URI of the uploaded image
  aiEstimation: AIEstimation;
  savedAt: string; // ISO string for the timestamp
}
