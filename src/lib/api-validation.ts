/**
 * API Request Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

/**
 * Nutrition API Query Params Schema
 */
export const nutritionQuerySchema = z.object({
  ingredientName: z
    .string()
    .min(1, 'Ingredient name is required')
    .max(100, 'Ingredient name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-']+$/, 'Ingredient name contains invalid characters'),
});

export type NutritionQuery = z.infer<typeof nutritionQuerySchema>;

/**
 * Recipe API Query Params Schema
 */
export const recipeQuerySchema = z.object({
  id: z.string().regex(/^\d+$/, 'Recipe ID must be numeric').optional(),
  search: z
    .string()
    .min(1, 'Search term must not be empty')
    .max(100, 'Search term must be less than 100 characters')
    .optional(),
});

export type RecipeQuery = z.infer<typeof recipeQuerySchema>;

/**
 * Meal Photo Upload Schema
 */
export const mealPhotoSchema = z.object({
  mealPhoto: z
    .string()
    .startsWith('data:image/', 'Must be a valid data URI image')
    .refine(
      (data) => {
        // Check size (base64 encoded size should be < ~5.3MB for 4MB limit)
        const base64Data = data.split(',')[1] || '';
        const sizeInBytes = (base64Data.length * 3) / 4;
        return sizeInBytes <= 4 * 1024 * 1024; // 4MB
      },
      { message: 'Image must be less than 4MB' }
    ),
});

export type MealPhoto = z.infer<typeof mealPhotoSchema>;

/**
 * Logged Meal Schema
 */
export const loggedMealSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  dateLogged: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  mealName: z
    .string()
    .min(1, 'Meal name is required')
    .max(200, 'Meal name must be less than 200 characters'),
  calories: z
    .number()
    .min(0, 'Calories must be non-negative')
    .max(10000, 'Calories must be less than 10000'),
  protein: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  source: z.enum(['AI', 'Manual']).optional(),
});

export type LoggedMeal = z.infer<typeof loggedMealSchema>;

/**
 * Saved Meal Schema
 */
export const savedMealSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  mealPhoto: z.string().startsWith('data:image/', 'Must be a valid data URI image'),
  aiEstimation: z.object({
    dishName: z.string(),
    estimatedCalories: z.number().min(0).max(10000),
    ingredients: z.array(z.string()),
    recipe: z
      .object({
        prepTime: z.string(),
        cookTime: z.string(),
        ingredients: z.array(z.string()),
        instructions: z.array(z.string()),
      })
      .optional(),
  }),
});

export type SavedMeal = z.infer<typeof savedMealSchema>;

/**
 * Helper function to validate API query parameters
 */
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): { success: true; data: T } | { success: false; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(params);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return { success: false, error: errors.join(', ') };
    }
  } catch (error) {
    return { success: false, error: 'Invalid query parameters' };
  }
}

/**
 * Helper function to validate request body
 */
export async function validateBody<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return { success: false, error: errors.join(', ') };
    }
  } catch (error) {
    return { success: false, error: 'Invalid request body' };
  }
}
