
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
import type { Recipe } from '@/types'; // Using our main Recipe type

// Define a simpler schema for recipes returned by the tool to the LLM
// This is what the LLM will see from the tool.
const RecipeShortSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().describe("A brief summary of the recipe."),
  keyIngredients: z.array(z.string()).optional().describe("A few (2-3) primary ingredients of the recipe.").optional(),
  calories: z.number().optional().describe("Estimated calories per serving, if available."), 
  dietaryRestrictions: z.array(z.string()).optional().describe("Dietary tags like Vegan, Gluten-Free etc."),
});
type RecipeShort = z.infer<typeof RecipeShortSchema>;


const searchRecipesTool = ai.defineTool(
  {
    name: 'searchRecipesTool',
    description: "Searches an external recipe database (Spoonacular) for recipes matching a query. Use this to find recipes by name, primary ingredient, or broad dietary keywords (e.g., vegan, gluten-free). Prioritize name matches.",
    inputSchema: z.object({
      searchTerm: z.string().describe('The user\'s query. This could be a recipe name, a main ingredient, or a general type like "vegan pasta".'),
    }),
    outputSchema: z.object({
      foundRecipes: z.array(RecipeShortSchema).describe('A list of recipes matching the search term. Returns up to 5 relevant recipes.'),
      searchSummary: z.string().describe("A brief summary of what was searched for and if any direct matches were found, e.g., 'Searched for vegan pasta recipes, found 3.' or 'No direct match for chocolate avocado smoothie, but found other smoothies.'"),
    }),
  },
  async ({ searchTerm }) => {
    const results: RecipeShort[] = [];
    let searchSummary = `Searched for recipes related to "${searchTerm}" using Spoonacular. `;

    try {
      // Fetch from our own API endpoint, which proxies to Spoonacular
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/recipes?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const recipesFromApi: Recipe[] = await response.json();

      recipesFromApi.slice(0, 5).forEach(recipeData => {
        results.push({
          id: recipeData.id,
          name: recipeData.name,
          description: recipeData.description ? recipeData.description.substring(0,150) + (recipeData.description.length > 150 ? "..." : "") : "A recipe for " + recipeData.name,
          calories: recipeData.calories,
          dietaryRestrictions: recipeData.dietaryRestrictions,
          keyIngredients: recipeData.ingredients.slice(0,3), // Take first 3 ingredients as key ingredients
        });
      });
      
      if (results.length > 0) {
        searchSummary += `Found ${results.length} relevant recipe(s).`;
      } else {
        searchSummary += "Found no direct matches for this specific term. You might try rephrasing or searching for a broader category.";
      }

    } catch (e) {
      console.error("Error in searchRecipesTool while fetching from Spoonacular via API:", e);
      searchSummary += "An error occurred while searching for recipes from the external API.";
       if (e instanceof Error) {
        searchSummary += ` Details: ${e.message}`;
      }
    }
    return { foundRecipes: results, searchSummary };
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
When presenting recipes from the tool, briefly mention the name, and maybe 1-2 key ingredients or its description. If calories are available, mention them (but state they are estimates if so). If dietary tags are available, mention key ones.
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
