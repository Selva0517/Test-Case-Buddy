'use client';

import { useState } from 'react';
import { type TestCase } from '@/lib/types';
import { exportToCsv, exportToTxt } from '@/lib/export';
import { suggestDetailsForTestCases } from '@/ai/flows/suggest-details-for-test-cases';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Download, Trash2, Eye, FileText, FileSpreadsheet, Sparkles, Loader2 } from 'lucide-react';

interface TestCaseDisplayProps {
  testCases: TestCase[];
  onClear: () => void;
  isLoading: boolean;
}

export default function TestCaseDisplay({ testCases, onClear, isLoading }: TestCaseDisplayProps) {
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<{ include: string; exclude: string } | null>(null);

  const { toast } = useToast();

  const handleExport = (format: 'csv' | 'txt') => {
    const message = format === 'csv' ? exportToCsv(testCases) : exportToTxt(testCases);
    toast({
      title: 'Export Successful',
      description: `Test cases have been ${message.toLowerCase()}.`,
    });
  };
  
  const handleViewDetails = (testCase: TestCase) => {
    setSelectedCase(testCase);
    setSuggestions(null);
    setDetailViewOpen(true);
  };
  
  const handleSuggestDetails = async () => {
    if (!selectedCase) return;
    setIsSuggesting(true);
    try {
      const result = await suggestDetailsForTestCases({ testCaseDescription: selectedCase.description });
      setSuggestions({
        include: result.suggestedDetailsToInclude,
        exclude: result.suggestedDetailsToExclude,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "Could not get AI suggestions. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Generated Cases</CardTitle>
            <CardDescription>Review, manage, and export your test cases.</CardDescription>
          </div>
          {testCases.length > 0 && (
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" onClick={onClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileSpreadsheet className="mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('txt')}>
                    <FileText className="mr-2" />
                    Export as TXT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <ScrollArea className="h-[450px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Case Title</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" /></TableCell>
                      <TableCell className="text-right"><div className="h-6 w-10 animate-pulse rounded-md bg-muted ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : testCases.length > 0 ? (
                  testCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell className="font-medium">{testCase.title}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(testCase)}>
                              <Eye className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No test cases generated yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>

      <Dialog open={isDetailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCase?.title}</DialogTitle>
            <DialogDescription>
              Details for the selected test case.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-4 py-4 pr-6">
              <div className="whitespace-pre-wrap font-code text-sm bg-muted/50 p-4 rounded-md border">
                {selectedCase?.description}
              </div>
              
              {suggestions ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600">Suggested to Include:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestions.include}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold text-red-600">Suggested to Exclude:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{suggestions.exclude}</p>
                  </div>
                </div>
              ) : (
                 <Button onClick={handleSuggestDetails} disabled={isSuggesting} variant="outline" className="mt-4">
                    {isSuggesting ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2 text-primary" />}
                    Get AI Suggestions
                </Button>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDetailViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
