
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
import { mockRecipes } from '@/lib/mock-data';
import type { Recipe } from '@/types';

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
export type RecipeShort = z.infer<typeof RecipeShortSchema>;


const searchRecipesTool = ai.defineTool(
  {
    name: 'searchRecipesTool',
    description: 'Searches the CalSnap recipe database for recipes matching a query. Use this to find recipes by name, ingredients, cuisine, or dietary restrictions.',
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

    mockRecipes.forEach(recipe => {
      const recipeNameMatch = recipe.name.toLowerCase().includes(lowerSearchTerm);
      const ingredientMatch = recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerSearchTerm));
      const cuisineMatch = recipe.cuisine.toLowerCase().includes(lowerSearchTerm);
      const dietaryMatch = recipe.dietaryRestrictions.some(tag => tag.toLowerCase().includes(lowerSearchTerm));

      if (recipeNameMatch || ingredientMatch || cuisineMatch || dietaryMatch) {
        results.push({
          id: recipe.id,
          name: recipe.name,
          cuisine: recipe.cuisine,
          description: recipe.description.substring(0, 100) + (recipe.description.length > 100 ? '...' : ''), // Keep description brief
          calories: recipe.calories,
          dietaryRestrictions: recipe.dietaryRestrictions,
          keyIngredients: recipe.ingredients.slice(0,3), // First 3 ingredients as key
        });
      }
    });
    
    const limitedResults = results.slice(0, 5); // Limit to 5 results
    let searchSummary = `Searched for "${searchTerm}". `;
    if (limitedResults.length > 0) {
      searchSummary += `Found ${limitedResults.length} relevant recipe(s).`;
    } else {
      searchSummary += "Found no direct matches in the current recipe database.";
    }

    return { foundRecipes: limitedResults, searchSummary };
  }
);

const RecipeChatInputSchema = z.object({
  userQuery: z.string().describe("The user's question or statement to the chatbot."),
  // conversationHistory: z.array(z.object({ role: z.enum(['user', 'model']), parts: z.array(z.object({ text: z.string()}))})).optional().describe("Previous turns in the conversation, if any.")
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
When presenting recipes, briefly mention the name, cuisine, and maybe 1-2 key ingredients or its description. If calories are available, mention them.
If a user asks about general calorie information for a food item not in a recipe, you can provide a general estimate but remind them that the CalSnap AI Meal Analyzer (photo upload) is best for specific meal estimations.
If no recipes are found, say so politely and perhaps offer to search for something else.
Keep your responses concise and conversational.

User's query: {{{userQuery}}}
`,
// TODO: Add conversation history for more context awareness in future iterations.
// {{#if conversationHistory}}
// Conversation History:
// {{#each conversationHistory}}
//   {{this.role}}: {{#each this.parts}}{{this.text}}{{/each}}
// {{/each}}
// {{/if}}
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await recipeChatPrompt(input); // Pass userQuery and potentially history
    const output = llmResponse.output; // Corrected: access as a property
    if (!output?.botResponse) {
      // Fallback response if LLM somehow doesn't generate one
      return { botResponse: "I'm sorry, I couldn't process that request. Could you try asking in a different way?" };
    }
    return output;
  }
);

