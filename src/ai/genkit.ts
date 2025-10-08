import 'dotenv/config';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Make sure that you have a GEMINI_API_KEY environment variable set in your .env file
// (see the .env.example file)
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
