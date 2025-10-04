'use server';

import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import { ImageEditResult, runImageEdit } from '../services';

const saveImagesToTempDir = async (
  images: File[]
): Promise<{ imagePaths: string[]; tempDir: string }> => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bible-images-'));

  const imagePaths = await Promise.all(
    images.map(async (image) => {
      if (!image.name || image.size === 0) {
        return null;
      }
      const imagePath = path.join(tempDir, image.name);
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(imagePath, buffer);
      return imagePath;
    })
  );

  return {
    imagePaths: imagePaths.filter((p): p is string => p !== null),
    tempDir,
  };
};

const deleteTempDir = async (tempDir: string) => {
  await fs.rm(tempDir, { recursive: true, force: true });
};

export async function handleImageUpload(formData: FormData): Promise<ImageEditResult[]> {
  const prompt = formData.get('prompt') as string;
  const images = formData.getAll('images') as File[];
  const variations = formData.get('variations') as string;

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  if (!images || images.length === 0 || images.every((i) => i.size === 0)) {
    throw new Error('At least one image is required');
  }

  if (
    !variations ||
    isNaN(Number(variations)) ||
    Number(variations) < 1 ||
    Number(variations) > 5
  ) {
    throw new Error('Variations must be a number between 1 and 5');
  }

  const { imagePaths, tempDir } = await saveImagesToTempDir(images);

  console.log(`Processing ${imagePaths.length} images with prompt: "${prompt}"`);
  const result = await runImageEdit(prompt, imagePaths, Number(variations));
  console.log(`Finished processing. Outputs: ${result}`);

  await deleteTempDir(tempDir);

  return result;
}
