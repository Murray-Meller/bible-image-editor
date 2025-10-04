'use server';
import { HumanMessage } from '@langchain/core/messages';
import { chat } from '../services/openai-config';

const generateInstructions = async (script: string) => {
  const prompt = `
	${script} 

	With this script create a prompt for a salient or representative image according to the following criteria in their current order.

  Variable: Subject description (if any)
  Variable: Scene/environment description
  Fixed: art style bold outline bible illustration style watercolor painting block colours
  Fixed: color scheme muted warm earthy tones
  Fixed: environment simple background gradient sky
  Variable: point of view ?
  Fixed: lighting soft flat
  Fixed: minimal shading

 
	Start by outputting a detailed description. Then refine the prompt detail down to its most essential components. Use around 50 words or less than 300 characters, it will be tokenised anyway, so we can ignore stop words, punctuation and most of the grammar.
	`;

  console.log('Generating instructions with LangChain and prompt:', prompt);

  const message = new HumanMessage(prompt);

  try {
    const { content } = await chat.invoke([message]);
    return content as string;
  } catch (err) {
    console.error('Error generating instructions with LangChain:', err);
    throw new Error('Failed to generate instructions.');
  }
};

export async function generateScript(formData: FormData): Promise<string> {
  const input = formData.get('input') as string;

  if (!input) {
    throw new Error('input is required');
  }

  console.log('Obtained script information:', input);

  const instructions = await generateInstructions(input);
  console.log('Generated instructions:', instructions);

  return instructions;
}
