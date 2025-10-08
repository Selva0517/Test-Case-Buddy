'use server';
/**
 * @fileOverview Suggests relevant details for test cases to improve their quality.
 *
 * - suggestDetailsForTestCases - A function that suggests details for test cases.
 * - SuggestDetailsForTestCasesInput - The input type for the suggestDetailsForTestCases function.
 * - SuggestDetailsForTestCasesOutput - The return type for the suggestDetailsForTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDetailsForTestCasesInputSchema = z.object({
  testCaseDescription: z
    .string()
    .describe('The description of the test case for which details are to be suggested.'),
  relevantDetails: z
    .string()
    .optional()
    .describe('The relevant details that the user wants to include in the test case.'),
});
export type SuggestDetailsForTestCasesInput = z.infer<
  typeof SuggestDetailsForTestCasesInputSchema
>;

const SuggestDetailsForTestCasesOutputSchema = z.object({
  suggestedDetailsToInclude: z
    .string()
    .describe('The suggested details that should be included in the test case.'),
  suggestedDetailsToExclude: z
    .string()
    .describe('The suggested details that should be excluded from the test case.'),
});
export type SuggestDetailsForTestCasesOutput = z.infer<
  typeof SuggestDetailsForTestCasesOutputSchema
>;

export async function suggestDetailsForTestCases(
  input: SuggestDetailsForTestCasesInput
): Promise<SuggestDetailsForTestCasesOutput> {
  return suggestDetailsForTestCasesFlow(input);
}

const suggestDetailsForTestCasesPrompt = ai.definePrompt({
  name: 'suggestDetailsForTestCasesPrompt',
  input: {schema: SuggestDetailsForTestCasesInputSchema},
  output: {schema: SuggestDetailsForTestCasesOutputSchema},
  prompt: `You are an AI assistant that helps users generate high-quality test cases.

  Based on the test case description and the provided relevant details, suggest which details should be included and excluded to improve the test case quality.

  Test Case Description: {{{testCaseDescription}}}
  Relevant Details: {{{relevantDetails}}}

  Include the details which are most relavant for the test case.
  Exclude the details which are not relavant for the test case.
  `,
});

const suggestDetailsForTestCasesFlow = ai.defineFlow(
  {
    name: 'suggestDetailsForTestCasesFlow',
    inputSchema: SuggestDetailsForTestCasesInputSchema,
    outputSchema: SuggestDetailsForTestCasesOutputSchema,
  },
  async input => {
    const {output} = await suggestDetailsForTestCasesPrompt(input);
    return output!;
  }
);
