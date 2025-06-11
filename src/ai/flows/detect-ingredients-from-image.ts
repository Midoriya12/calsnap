// detect-ingredients-from-image.ts
'use server';

/**
 * @fileOverview Detects ingredients from an image of a meal.
 *
 * - detectIngredientsFromImage - A function that handles the ingredient detection process.
 * - DetectIngredientsFromImageInput - The input type for the detectIngredientsFromImage function.
 * - DetectIngredientsFromImageOutput - The return type for the detectIngredientsFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectIngredientsFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectIngredientsFromImageInput = z.infer<typeof DetectIngredientsFromImageInputSchema>;

const DetectIngredientsFromImageOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients detected in the image.'),
});
export type DetectIngredientsFromImageOutput = z.infer<typeof DetectIngredientsFromImageOutputSchema>;

export async function detectIngredientsFromImage(
  input: DetectIngredientsFromImageInput
): Promise<DetectIngredientsFromImageOutput> {
  return detectIngredientsFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectIngredientsFromImagePrompt',
  input: {schema: DetectIngredientsFromImageInputSchema},
  output: {schema: DetectIngredientsFromImageOutputSchema},
  prompt: `You are an expert food ingredient identifier.

You will be provided with a photo of a meal. You will identify the ingredients in the meal and return a list of ingredients.

Photo: {{media url=photoDataUri}}

List of ingredients:`,
});

const detectIngredientsFromImageFlow = ai.defineFlow(
  {
    name: 'detectIngredientsFromImageFlow',
    inputSchema: DetectIngredientsFromImageInputSchema,
    outputSchema: DetectIngredientsFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
