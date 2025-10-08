'use server';
/**
 * @fileOverview Corrects and improves software requirements using AI.
 *
 * - correctRequirements - A function that corrects and improves software requirements.
 * - CorrectRequirementsInput - The input type for the correctRequirements function.
 * - CorrectRequirementsOutput - The return type for the correctRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectRequirementsInputSchema = z.object({
  requirements: z.string().describe('The software requirements to be corrected.'),
});
export type CorrectRequirementsInput = z.infer<typeof CorrectRequirementsInputSchema>;

const CorrectRequirementsOutputSchema = z.object({
  correctedRequirements: z.string().describe('The corrected and improved software requirements.'),
});
export type CorrectRequirementsOutput = z.infer<typeof CorrectRequirementsOutputSchema>;

export async function correctRequirements(input: CorrectRequirementsInput): Promise<CorrectRequirementsOutput> {
  return correctRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctRequirementsPrompt',
  input: {schema: CorrectRequirementsInputSchema},
  output: {schema: CorrectRequirementsOutputSchema},
  prompt: `You are an expert technical writer. Your task is to correct and improve the following software requirements.

Focus on:
- Fixing spelling, grammar, and punctuation errors.
- Improving clarity and removing ambiguity.
- Rephrasing to sound more professional and structured.
- Ensuring the output is a clear, actionable requirement suitable for generating test cases.
- Do not add any extra text, comments or markdown. Return only the corrected requirement text.

Original Requirements: {{{requirements}}}

Return the corrected requirements in the requested JSON format.
`,
});

const correctRequirementsFlow = ai.defineFlow(
  {
    name: 'correctRequirementsFlow',
    inputSchema: CorrectRequirementsInputSchema,
    outputSchema: CorrectRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
