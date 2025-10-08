'use client';

import type * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Wand2, Loader2 } from 'lucide-react';

interface GeneratorFormProps {
  requirements: string;
  setRequirements: (value: string) => void;
  includeDetails: boolean;
  setIncludeDetails: (value: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function GeneratorForm({
  requirements,
  setRequirements,
  includeDetails,
  setIncludeDetails,
  onSubmit,
  isLoading,
}: GeneratorFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Test Requirements</CardTitle>
        <CardDescription>
          Enter your software requirements or user story. The more detailed, the better the test cases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="e.g., As a user, I should be able to reset my password via a link sent to my email."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[200px] text-base"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="include-details" 
                checked={includeDetails}
                onCheckedChange={setIncludeDetails}
                disabled={isLoading}
              />
              <Label htmlFor="include-details">Include detailed steps</Label>
            </div>
            <Button type="submit" disabled={isLoading || !requirements}>
              {isLoading ? (
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
        </form>
      </CardContent>
    </Card>
  );
}
