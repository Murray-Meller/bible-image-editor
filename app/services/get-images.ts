import 'server-only';
import path from 'path';
import sharp from 'sharp';
import { File } from '@web-std/file';

export type InputImage = {
  imagePath: string;
  imageFile: File;
};

async function convertImage(imagePath: string, originalFilename: string): Promise<File> {
  const imageBuffer = await sharp(imagePath).ensureAlpha().toFormat('png').toBuffer();

  const mimeType = 'image/png';
  const uint8Array = new Uint8Array(imageBuffer);

  return new File(
    [uint8Array],
    `${path.basename(originalFilename, path.extname(originalFilename))}.png`,
    { type: mimeType }
  );
}

export async function getImagesFromPaths(imagePaths: string[]): Promise<InputImage[]> {
  return Promise.all(
    imagePaths.map(async (imagePath) => {
      const convertedFile = await convertImage(imagePath, path.basename(imagePath));

      return {
        imagePath,
        imageFile: convertedFile,
      };
    })
  );
}
