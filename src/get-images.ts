import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { File } from '@web-std/file';

export type ExampleImage = {
  image: string;
  imagePath: string;
  convertedFile?: File;
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

export async function getImages(inputDir: string): Promise<ExampleImage[]> {
  const files = await fs.promises.readdir(inputDir);

  const images = await Promise.all(
    files.map(async (file) => {
      const imagePath = path.join(inputDir, file);
      const convertedFile = await convertImage(imagePath, file);

      return {
        imagePath,
        image: file,
        convertedFile,
      };
    })
  );

  console.log(`Found ${images.length} images in "${inputDir}"`);

  return images;
}
