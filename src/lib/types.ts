export type TestCase = {
  id: string;
  title: string;
  description: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  actualResult: string;
  status: 'Pass' | 'Fail' | 'Not Executed';
  priority: 'High' | 'Medium' | 'Low';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  comments: string;
};
