
// This file is no longer the primary source for recipes for the catalog or chatbot.
// It can be kept for other testing purposes or removed if no longer needed.
// The Recipe type is now defined in src/types/index.ts

// To avoid build errors if other parts of the app might still import mockRecipes,
// I'll leave it as an empty array or remove its export.
// For now, I'll remove the export of mockRecipes.

// import type { Recipe } from '@/types';

// export const mockRecipes: Recipe[] = [ ... ]; // Original mock data removed or commented out

// If you need a small set of mock recipes for testing other components, 
// you can define them here but they won't be used by the main recipe features.

export {}; // Ensure this file is treated as a module if all exports are removed.
