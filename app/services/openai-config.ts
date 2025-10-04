import 'server-only';
import { OpenAI } from 'openai';
import { ChatOpenAI } from '@langchain/openai';

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Please set the OPENAI_API_KEY environment variable in your .env file');
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = new ChatOpenAI({
  temperature: 0.8,
  modelName: 'gpt-4o',
});
