'use server';
/**
 * @fileOverview Parses user input to identify key requirements and automatically generate relevant test case ideas.
 *
 * - parseUserInputForTestCases - A function that handles the parsing of user input and generates test case ideas.
 * - ParseUserInputForTestCasesInput - The input type for the parseUserInputForTestCases function.
 * - ParseUserInputForTestCasesOutput - The return type for the parseUserInputForTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseUserInputForTestCasesInputSchema = z.object({
  userInput: z.string().describe('The user input string containing requirements or feature descriptions.'),
});
export type ParseUserInputForTestCasesInput = z.infer<typeof ParseUserInputForTestCasesInputSchema>;

const ParseUserInputForTestCasesOutputSchema = z.object({
  testCaseIdeas: z.array(z.string()).describe('An array of test case ideas generated from the user input.'),
});
export type ParseUserInputForTestCasesOutput = z.infer<typeof ParseUserInputForTestCasesOutputSchema>;

export async function parseUserInputForTestCases(input: ParseUserInputForTestCasesInput): Promise<ParseUserInputForTestCasesOutput> {
  return parseUserInputForTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseUserInputForTestCasesPrompt',
  input: {schema: ParseUserInputForTestCasesInputSchema},
  output: {schema: ParseUserInputForTestCasesOutputSchema},
  prompt: `You are a test case generation expert. Your job is to take user input and generate test case ideas based on it.

User Input: {{{userInput}}}

Generate a list of test case ideas based on the user input. Focus on identifying key requirements, scenarios, and edge cases.
Ensure each test case idea is specific and actionable.
`,
});

const parseUserInputForTestCasesFlow = ai.defineFlow(
  {
    name: 'parseUserInputForTestCasesFlow',
    inputSchema: ParseUserInputForTestCasesInputSchema,
    outputSchema: ParseUserInputForTestCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
