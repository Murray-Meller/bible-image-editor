import 'server-only';
import { OpenAI } from 'openai';

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Please set the OPENAI_API_KEY environment variable in your .env file');
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
