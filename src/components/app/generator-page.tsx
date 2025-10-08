
'use client';

import { useState } from 'react';
import { generateTestCasesFromRequirements } from '@/ai/flows/generate-test-cases-from-requirements';
import { parseUserInputForTestCases } from '@/ai/flows/parse-user-input-for-test-cases';
import { useToast } from '@/hooks/use-toast';
import { type TestCase } from '@/lib/types';
import GeneratorForm from '@/components/app/generator-form';
import TestCaseDisplay from '@/components/app/test-case-display';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function GeneratorPage() {
  const [requirements, setRequirements] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testCaseIdeas, setTestCaseIdeas] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!requirements.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter some requirements to generate test cases.",
      });
      return;
    }
    setIsGenerating(true);
    setTestCases([]);
    setTestCaseIdeas([]);
    try {
      const result = await generateTestCasesFromRequirements({ requirements, includeDetails });
      const parsedCases = result.testCases.map((tc, index) => ({
        ...tc,
        id: `TC-${Date.now()}-${index}`,
        actualResult: '',
        status: 'Not Executed',
        comments: '',
      }));
      setTestCases(parsedCases);

      if (parsedCases.length === 0) {
        toast({
          title: "Generation Complete",
          description: "The AI couldn't generate structured test cases from your input. Try rephrasing your requirements.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An error occurred while generating test cases. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleParse = async () => {
    if (!requirements.trim() || isParsing) return;
    setIsParsing(true);
    try {
      const result = await parseUserInputForTestCases({ userInput: requirements });
      setTestCaseIdeas(result.testCaseIdeas);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to Get Ideas",
        description: "An error occurred while parsing your input. Please try again.",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleClear = () => {
    setTestCases([]);
    toast({
      title: "Cleared",
      description: "Generated test cases have been cleared.",
    })
  };
  
  const handleUpdateTestCase = (updatedCase: TestCase) => {
    setTestCases(prev => prev.map(tc => tc.id === updatedCase.id ? updatedCase : tc));
  };


  return (
    <div id="generator" className="p-4 sm:p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
        
        <div className="lg:col-span-3 xl:col-span-1">
          <GeneratorForm 
            requirements={requirements}
            setRequirements={setRequirements}
            includeDetails={includeDetails}
            setIncludeDetails={setIncludeDetails}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        <div className="lg:col-span-4 xl:col-span-2">
          <Tabs defaultValue="cases" className="h-full">
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value="cases">Generated Test Cases</TabsTrigger>
                <TabsTrigger value="ideas" onClick={handleParse} disabled={isParsing || !requirements}>
                  {isParsing ? 'Analyzing...' : 'Get Ideas'}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="cases" className="mt-4">
              <TestCaseDisplay 
                testCases={testCases} 
                onClear={handleClear} 
                isLoading={isGenerating}
                onUpdateTestCase={handleUpdateTestCase}
              />
            </TabsContent>

            <TabsContent value="ideas" className="mt-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Test Case Ideas</CardTitle>
                  <CardDescription>
                    AI-suggested ideas based on your requirements. Use these to refine your input.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  {isParsing ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-full animate-pulse rounded-md bg-muted" />
                      ))}
                    </div>
                  ) : testCaseIdeas.length > 0 ? (
                    <ScrollArea className="h-[450px] pr-4">
                      <ul className="space-y-3 text-sm">
                        {testCaseIdeas.map((idea, index) => (
                          <li key={index} className="rounded-md border p-3 font-mono text-xs transition-colors hover:bg-muted/50">
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed text-center text-sm text-muted-foreground">
                      <p>Click &quot;Get Ideas&quot; to see suggestions here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
