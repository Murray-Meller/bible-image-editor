import { openai } from './openai-config';
import { ExampleImage } from './get-images';

export interface ImageEditResult {
  imagePath: string;
  imageBase64: string;
}

export async function editImage(
  { imagePath, convertedFile }: ExampleImage,
  prompt: string
): Promise<ImageEditResult | null> {
  if (!convertedFile) {
    console.warn(`No converted file available for image "${imagePath}"`);
    return null;
  }

  console.log(`Converting image for "${imagePath}"`);

  try {
    const editResponse = await openai.images.edit({
      image: convertedFile,
      prompt,
      n: 1,
      size: 'auto',
      input_fidelity: 'high',
      model: 'gpt-image-1',
    });

    if (!editResponse.data?.[0]?.b64_json) {
      console.error(`No image returned for prompt "${prompt}" and image "${imagePath}"`);
      return null;
    }

    console.log(`Successfully edited: ${imagePath}`);
    const imageBase64 = editResponse.data[0].b64_json;
    return { imagePath, imageBase64 };
  } catch (error) {
    console.error(`Error processing image "${imagePath}":`, error);
    return null;
  }
}
