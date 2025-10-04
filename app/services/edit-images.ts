import 'server-only';
import { openai } from './openai-config';
import { InputImage } from './get-images';

export interface EditedImage extends InputImage {
  editedImagesAsBase64: string[];
}

export async function editImage(input: InputImage, prompt: string): Promise<EditedImage> {
  console.log(`Converting image for "${input.imagePath}"`);

  try {
    const editResponse = await openai.images.edit({
      image: input.imageFile,
      prompt,
      n: 1,
      size: 'auto',
      input_fidelity: 'high',
      quality: 'high',
      model: 'gpt-image-1',
    });

    if (!editResponse.data || editResponse.data.length === 0) {
      console.error(`No image returned for prompt "${prompt}" and image "${input.imagePath}"`);
      return { ...input, editedImagesAsBase64: [] };
    }

    const editedImagesAsBase64 =
      editResponse.data.map((x) => x.b64_json).filter((x): x is string => x != null) ?? [];

    console.log(`Successfully edited: ${input.imagePath}`);

    return { ...input, editedImagesAsBase64 };
  } catch (error) {
    console.error(`Error processing image "${input.imagePath}":`, error);
    return { ...input, editedImagesAsBase64: [] };
  }
}
