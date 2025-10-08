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

const TestCaseSchema = z.object({
  title: z.string().describe('The title of the test case.'),
  description: z.string().describe('A brief description of the test case.'),
  preconditions: z.string().describe('The preconditions for the test case.'),
  steps: z
    .array(z.string())
    .describe('The steps to execute for the test case.'),
  expectedResult: z.string().describe('The expected result of the test case.'),
  priority: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The priority of the test case.'),
  severity: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .describe('The severity of the test case.'),
});

const GenerateTestCasesFromRequirementsInputSchema = z.object({
  requirements: z
    .string()
    .describe('The software requirements to generate test cases for.'),
  includeDetails: z
    .boolean()
    .describe('Whether to include detailed steps in the test cases.'),
});

export type GenerateTestCasesFromRequirementsInput = z.infer<
  typeof GenerateTestCasesFromRequirementsInputSchema
>;

const GenerateTestCasesFromRequirementsOutputSchema = z.object({
  testCases: z
    .array(TestCaseSchema)
    .describe('The generated test cases covering various scenarios.'),
});

export type GenerateTestCasesFromRequirementsOutput = z.infer<
  typeof GenerateTestCasesFromRequirementsOutputSchema
>;

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
  prompt: `You are a test case generation expert. Generate a comprehensive set of test cases based on the following software requirements. For each test case, provide a title, description, preconditions, detailed test steps, expected result, priority, and severity.

Requirements: {{{requirements}}}

{{#if includeDetails}}
Generate detailed test cases including preconditions, step-by-step instructions, and expected outcomes.
{{else}}
Generate high-level test cases with titles and descriptions.
{{/if}}

Generate the test cases in the requested JSON format.
`,
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
