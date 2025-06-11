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
  estimatedCalories: number;
  ingredients: string[];
}
