
import { config } from 'dotenv';
config();

import '@/ai/flows/detect-ingredients-from-image.ts';
import '@/ai/flows/guess-calories-from-image.ts';
import '@/ai/flows/recipe-chat-flow.ts'; // Import the new recipe chat flow
