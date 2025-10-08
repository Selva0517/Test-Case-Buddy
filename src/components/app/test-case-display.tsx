'use client';

import { useState } from 'react';
import { type TestCase } from '@/lib/types';
import { exportToCsv, exportToTxt } from '@/lib/export';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Download, Trash2, Eye, FileText, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TestCaseDisplayProps {
  testCases: TestCase[];
  onClear: () => void;
  isLoading: boolean;
  onUpdateTestCase: (testCase: TestCase) => void;
}

export default function TestCaseDisplay({ testCases, onClear, isLoading, onUpdateTestCase }: TestCaseDisplayProps) {
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  
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
    setDetailViewOpen(true);
  };
  
  const handleSaveChanges = () => {
    if (selectedCase) {
      onUpdateTestCase(selectedCase);
      toast({
        title: "Changes Saved",
        description: `Test case ${selectedCase.id} has been updated.`,
      });
    }
    setDetailViewOpen(false);
  }

  const handleDialogStateChange = (open: boolean) => {
    if (!open) {
        setSelectedCase(null);
    }
    setDetailViewOpen(open);
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
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><div className="h-6 w-full animate-pulse rounded-md bg-muted" /></TableCell>
                    </TableRow>
                  ))
                ) : testCases.length > 0 ? (
                  testCases.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell className="font-mono text-xs">{testCase.id}</TableCell>
                      <TableCell className="font-medium max-w-xs truncate">{testCase.title}</TableCell>
                      <TableCell>
                        <Badge variant={testCase.priority === 'High' ? 'destructive' : 'secondary'}>{testCase.priority}</Badge>
                      </TableCell>
                       <TableCell>
                        <Badge variant={testCase.status === 'Pass' ? 'default' : testCase.status === 'Fail' ? 'destructive' : 'outline'}>{testCase.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(testCase)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No test cases generated yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>

      <Dialog open={isDetailViewOpen} onOpenChange={handleDialogStateChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Test Case Details: {selectedCase?.id}</DialogTitle>
            <DialogDescription>
              {selectedCase?.title}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {selectedCase && (
               <div className="grid gap-6 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 rounded-md border bg-muted/20">{selectedCase.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Preconditions</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 rounded-md border bg-muted/20">{selectedCase.preconditions}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Test Steps</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap p-3 rounded-md border bg-muted/20">
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedCase.steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Expected Result</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 rounded-md border bg-muted/20">{selectedCase.expectedResult}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className='space-y-2'>
                    <Label>Status</Label>
                    <Select value={selectedCase.status} onValueChange={(value) => setSelectedCase({...selectedCase, status: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Executed">Not Executed</SelectItem>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className='space-y-2'>
                    <Label>Priority</Label>
                     <Select value={selectedCase.priority} onValueChange={(value) => setSelectedCase({...selectedCase, priority: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className='space-y-2'>
                    <Label>Severity</Label>
                     <Select value={selectedCase.severity} onValueChange={(value) => setSelectedCase({...selectedCase, severity: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="actualResult">Actual Result</Label>
                  <Textarea id="actualResult" value={selectedCase.actualResult} onChange={(e) => setSelectedCase({...selectedCase, actualResult: e.target.value})} placeholder="Describe what actually happened..." />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="comments">Comments / Attachments</Label>
                  <Textarea id="comments" value={selectedCase.comments} onChange={(e) => setSelectedCase({...selectedCase, comments: e.target.value})} placeholder="Add any comments or links to attachments..." />
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailViewOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
