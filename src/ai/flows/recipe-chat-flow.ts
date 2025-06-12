
'use server';
/**
 * @fileOverview A chatbot flow for CalSnap to answer recipe-related questions.
 *
 * - recipeChatFlow - Handles user queries about recipes, ingredients, and calories.
 * - RecipeChatInput - The input type for the recipeChatFlow function.
 * - RecipeChatOutput - The return type for the recipeChatFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// import { db } from '@/lib/firebase'; // Firestore import no longer needed for mock data
// import { collection, query, where, getDocs, limit, or } from 'firebase/firestore'; // Firestore query methods no longer needed
import type { Recipe } from '@/types';
import { mockRecipes } from '@/lib/mock-data'; // Import mockRecipes

// Define a simpler schema for recipes returned by the tool to the LLM
const RecipeShortSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuisine: z.string(),
  description: z.string().optional(),
  calories: z.number().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  // Only include a few key ingredients to keep the context for LLM concise
  keyIngredients: z.array(z.string()).describe("A few (2-3) primary ingredients of the recipe.").optional(),
});
type RecipeShort = z.infer<typeof RecipeShortSchema>;


const searchRecipesTool = ai.defineTool(
  {
    name: 'searchRecipesTool',
    description: 'Searches the CalSnap recipe database for recipes matching a query. Use this to find recipes by name, ingredients, cuisine, or dietary restrictions. Prioritize name matches.',
    inputSchema: z.object({
      searchTerm: z.string().describe('The user\'s query. This could be a recipe name, an ingredient, a cuisine type (e.g., Italian, Mexican), a dietary tag (e.g., Vegan, Gluten-Free, Keto), or a general description of what the user is looking for.'),
    }),
    outputSchema: z.object({
      foundRecipes: z.array(RecipeShortSchema).describe('A list of recipes matching the search term. Returns up to 5 relevant recipes.'),
      searchSummary: z.string().describe("A brief summary of what was searched for and if any direct matches were found, e.g., 'Searched for vegan pasta recipes, found 3.' or 'No direct match for chocolate avocado smoothie, but found other smoothies.'"),
    }),
  },
  async ({ searchTerm }) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results: RecipeShort[] = [];
    let searchSummary = `Searched for "${searchTerm}". `;

    try {
      // Search logic for mockRecipes
      const matched = mockRecipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(lowerSearchTerm);
        const cuisineMatch = recipe.cuisine.toLowerCase().includes(lowerSearchTerm);
        const ingredientMatch = recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerSearchTerm));
        const dietaryMatch = recipe.dietaryRestrictions.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
        return nameMatch || cuisineMatch || ingredientMatch || dietaryMatch;
      });

      matched.slice(0, 5).forEach(recipeData => {
        results.push({
          id: recipeData.id,
          name: recipeData.name,
          cuisine: recipeData.cuisine,
          description: recipeData.description.substring(0, 100) + (recipeData.description.length > 100 ? '...' : ''),
          calories: recipeData.calories,
          dietaryRestrictions: recipeData.dietaryRestrictions,
          keyIngredients: recipeData.ingredients.slice(0,3),
        });
      });
      
      if (results.length > 0) {
        searchSummary += `Found ${results.length} relevant recipe(s) in the mock data.`;
      } else {
        searchSummary += "Found no direct matches in the mock recipe data for this specific term. You might try rephrasing or searching for a broader category.";
      }

    } catch (e) {
      console.error("Mock data search error in searchRecipesTool:", e);
      searchSummary += "An error occurred while searching the mock recipe data.";
    }

    return { foundRecipes: results.slice(0, 5), searchSummary }; // Ensure we don't exceed 5
  }
);

const RecipeChatInputSchema = z.object({
  userQuery: z.string().describe("The user's question or statement to the chatbot."),
  conversationHistory: z.array(
    z.object({ 
      role: z.enum(['user', 'model']), 
      parts: z.array(z.object({ text: z.string()}))
    })
  ).optional().describe("Previous turns in the conversation, if any, to provide context. The order is oldest message first.")
});
export type RecipeChatInput = z.infer<typeof RecipeChatInputSchema>;

const RecipeChatOutputSchema = z.object({
  botResponse: z.string().describe("The chatbot's response to the user."),
});
export type RecipeChatOutput = z.infer<typeof RecipeChatOutputSchema>;


export async function recipeChat(input: RecipeChatInput): Promise<RecipeChatOutput> {
  return recipeChatFlow(input);
}

const recipeChatPrompt = ai.definePrompt({
  name: 'recipeChatPrompt',
  input: { schema: RecipeChatInputSchema },
  output: { schema: RecipeChatOutputSchema },
  tools: [searchRecipesTool],
  prompt: `You are CalSnap AI, a friendly and helpful assistant for the CalSnap app.
Your goal is to assist users with their questions about recipes, ingredients, calories, and meal planning.
Always use the 'searchRecipesTool' to find specific recipes when the user asks for them or describes what they are looking for (e.g., "any vegan pasta recipes?", "how many calories in carbonara?", "ingredients for lentil soup").
When presenting recipes from the tool, briefly mention the name, cuisine, and maybe 1-2 key ingredients or its description. If calories are available, mention them.
If a user asks about general calorie information for a food item not in a recipe, you can provide a general estimate but remind them that the CalSnap AI Meal Analyzer (photo upload) is best for specific meal estimations.
If no recipes are found by the tool, say so politely based on the tool's summary and perhaps offer to search for something else or suggest they broaden their search.
Keep your responses concise and conversational.

{{#if conversationHistory}}
Conversation History (oldest to newest):
{{#each conversationHistory}}
{{this.role}}: {{#each this.parts}}{{this.text}}{{/each}}
{{/each}}

Now, considering the above history, respond to the current user query.
{{/if}}
User's query: {{{userQuery}}}
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await recipeChatPrompt(input); 
    const output = llmResponse.output;
    if (!output?.botResponse) {
      // Fallback response if LLM somehow doesn't generate one
      return { botResponse: "I'm sorry, I couldn't process that request. Could you try asking in a different way?" };
    }
    return output;
  }
);

