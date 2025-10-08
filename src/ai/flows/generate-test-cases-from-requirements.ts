'use server';
/**
 * @fileOverview Generates test cases from software requirements.
 *
 * - generateTestCasesFromRequirements - A function that generates test cases from requirements.
 * - GenerateTestCasesFromRequirementsInput - The input type for the generateTestCasesFromRequirements function.
 * - GenerateTestCasesFromRequirementsOutput - The return type for the generateTestCasesFromRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesFromRequirementsInputSchema = z.object({
  requirements: z
    .string()
    .describe('The software requirements to generate test cases for.'),
  includeDetails: z.boolean().describe('Whether to include detailed steps in the test cases.'),
});

export type GenerateTestCasesFromRequirementsInput =
  z.infer<typeof GenerateTestCasesFromRequirementsInputSchema>;

const GenerateTestCasesFromRequirementsOutputSchema = z.object({
  testCases: z
    .string()
    .describe('The generated test cases covering various scenarios.'),
});

export type GenerateTestCasesFromRequirementsOutput =
  z.infer<typeof GenerateTestCasesFromRequirementsOutputSchema>;

export async function generateTestCasesFromRequirements(
  input: GenerateTestCasesFromRequirementsInput
): Promise<GenerateTestCasesFromRequirementsOutput> {
  return generateTestCasesFromRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesFromRequirementsPrompt',
  input: {
    schema: GenerateTestCasesFromRequirementsInputSchema,
  },
  output: {
    schema: GenerateTestCasesFromRequirementsOutputSchema,
  },
  prompt: `You are a test case generation expert. Generate test cases based on the following software requirements, covering various scenarios and edge cases.\n\nRequirements: {{{requirements}}}\n\nInclude Details: {{#if includeDetails}}Yes{{else}}No{{/if}}\n\nTest Cases:`, // Modified prompt to use Handlebars syntax for includeDetails
});

const generateTestCasesFromRequirementsFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFromRequirementsFlow',
    inputSchema: GenerateTestCasesFromRequirementsInputSchema,
    outputSchema: GenerateTestCasesFromRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
