'use client';

import type * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Wand2, Loader2, Sparkles } from 'lucide-react';

interface GeneratorFormProps {
  requirements: string;
  setRequirements: (value: string) => void;
  includeDetails: boolean;
  setIncludeDetails: (value: boolean) => void;
  onSubmit: () => void;
  onCorrect: () => void;
  isGenerating: boolean;
  isCorrecting: boolean;
}

export default function GeneratorForm({
  requirements,
  setRequirements,
  includeDetails,
  setIncludeDetails,
  onSubmit,
  onCorrect,
  isGenerating,
  isCorrecting,
}: GeneratorFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const isLoading = isGenerating || isCorrecting;

  return (
    <Card className="h-full shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Test Requirements
        </CardTitle>
        <CardDescription>
          Enter a user story or requirement. The more detailed it is, the better the test cases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="requirements" className="font-semibold">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="e.g., As a user, I should be able to reset my password via a link sent to my email."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[200px] text-base"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <Switch 
                id="include-details" 
                checked={includeDetails}
                onCheckedChange={setIncludeDetails}
                disabled={isLoading}
              />
              <Label htmlFor="include-details">Include detailed steps</Label>
            </div>
            <div className='flex items-center gap-2'>
              <Button type="button" variant="outline" onClick={onCorrect} disabled={isLoading || !requirements} size="lg">
                {isCorrecting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Correcting...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Auto-Correct
                  </>
                )}
              </Button>
              <Button type="submit" disabled={isLoading || !requirements} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
