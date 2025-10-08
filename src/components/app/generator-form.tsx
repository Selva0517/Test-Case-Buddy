'use client';

import { useEffect, useState, useRef } from 'react';
import type * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import { correctRequirements } from '@/ai/flows/correct-requirements';

interface GeneratorFormProps {
  requirements: string;
  setRequirements: (value: string) => void;
  includeDetails: boolean;
  setIncludeDetails: (value: boolean) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export default function GeneratorForm({
  requirements,
  setRequirements,
  includeDetails,
  setIncludeDetails,
  onSubmit,
  isGenerating,
}: GeneratorFormProps) {
  const [isCorrecting, setIsCorrecting] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    onSubmit();
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRequirements = e.target.value;
    setRequirements(newRequirements);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (newRequirements.trim().length > 10) {
      setIsCorrecting(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const result = await correctRequirements({ requirements: newRequirements });
          if (result.correctedRequirements) {
            setRequirements(result.correctedRequirements);
          }
        } catch (error) {
          console.error("Auto-correction failed:", error);
        } finally {
          setIsCorrecting(false);
        }
      }, 1500);
    } else {
        setIsCorrecting(false);
    }
  };
  
  const isLoading = isGenerating;
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);


  return (
    <Card className="h-full shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Test Requirements
        </CardTitle>
        <CardDescription>
          Enter a user story or requirement. The AI will auto-correct it as you type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="requirements" className="font-semibold flex items-center justify-between">
              Requirements
              {isCorrecting && (
                <span className='flex items-center gap-1.5 text-xs font-normal text-muted-foreground'>
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Auto-correcting...
                </span>
              )}
            </Label>
            <Textarea
              id="requirements"
              placeholder="e.g., As a user, I should be able to reset my password via a link sent to my email."
              value={requirements}
              onChange={handleRequirementsChange}
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
