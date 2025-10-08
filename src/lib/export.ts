'use client';

import { type TestCase } from './types';

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(cell: string | string[]): string {
    if (typeof cell === 'undefined' || cell === null) {
        return '""';
    }
    const text = Array.isArray(cell) ? cell.map((s, i) => `${i+1}. ${s}`).join('\n') : String(cell);
    const
     escapedText = text.replace(/"/g, '""');
    return `"${escapedText}"`;
}


export function exportToTxt(testCases: TestCase[]): string {
  const content = testCases
    .map(tc => {
      return `Test Case ID: ${tc.id}
Title: ${tc.title}
Description: ${tc.description}
Preconditions: ${tc.preconditions}
Test Steps:\n${tc.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
Expected Result: ${tc.expectedResult}
Actual Result: ${tc.actualResult}
Status: ${tc.status}
Priority: ${tc.priority}
Severity: ${tc.severity}
Comments: ${tc.comments}
`;
    })
    .join('\n---\n\n');
  downloadFile('test-cases.txt', content, 'text/plain;charset=utf-8;');
  return 'Exported to TXT';
}

export function exportToCsv(testCases: TestCase[]): string {
  const headers = [
    'Test Case ID',
    'Title',
    'Description',
    'Preconditions',
    'Test Steps',
    'Expected Result',
    'Actual Result',
    'Status (Pass/Fail)',
    'Priority',
    'Severity',
    'Comments / Attachments'
  ];
  
  const headerRow = headers.join(',');
  
  const rows = testCases.map(tc => {
    return [
      escapeCsvCell(tc.id),
      escapeCsvCell(tc.title),
      escapeCsvCell(tc.description),
      escapeCsvCell(tc.preconditions),
      escapeCsvCell(tc.steps),
      escapeCsvCell(tc.expectedResult),
      escapeCsvCell(tc.actualResult),
      escapeCsvCell(tc.status),
      escapeCsvCell(tc.priority),
      escapeCsvCell(tc.severity),
      escapeCsvCell(tc.comments)
    ].join(',');
  }).join('\n');

  const content = `${headerRow}\n${rows}`;
  downloadFile('test-cases.csv', content, 'text/csv;charset=utf-8;');
  return 'Exported to CSV';
}
