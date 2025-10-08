import { config } from 'dotenv';
config();

import '@/ai/flows/generate-test-cases-from-requirements.ts';
import '@/ai/flows/suggest-details-for-test-cases.ts';
import '@/ai/flows/parse-user-input-for-test-cases.ts';