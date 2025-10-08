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

export function exportToTxt(testCases: TestCase[]): string {
  const content = testCases
    .map(tc => `Test Case: ${tc.title}\n\n${tc.description}`)
    .join('\n\n---\n\n');
  downloadFile('test-cases.txt', content, 'text/plain;charset=utf-8;');
  return 'Exported to TXT';
}

export function exportToCsv(testCases: TestCase[]): string {
  const header = 'ID,Title,Description\n';
  const rows = testCases
    .map(tc => {
      const id = `"${tc.id.replace(/"/g, '""')}"`;
      const title = `"${tc.title.replace(/"/g, '""')}"`;
      const description = `"${tc.description.replace(/"/g, '""')}"`;
      return `${id},${title},${description}`;
    })
    .join('\n');
  const content = header + rows;
  downloadFile('test-cases.csv', content, 'text/csv;charset=utf-8;');
  return 'Exported to CSV';
}
