import 'server-only';
import fs from 'fs';
import path from 'path';
import { getImagesFromPaths } from './get-images';
import { editImage } from './edit-images';
import { saveFile } from './save-images';

const OUTPUT_DIR = process.env.OUTPUT_DIR || 'output';
const OUTPUT_BASE = path.join(process.cwd(), OUTPUT_DIR);

const createOutputDir = async () => {
  const timestamp = new Date().toISOString();
  const outputDir = path.join(OUTPUT_BASE, timestamp);

  await fs.promises.mkdir(outputDir, { recursive: true });

  return outputDir;
};

export async function runImageEdit(prompt: string, imagePaths: string[]) {
  const outputDir = await createOutputDir();

  console.log(`Using prompt: "${prompt}"`);
  console.log(`Output dir: "${outputDir}"`);

  const images = await getImagesFromPaths(imagePaths);

  const results = await Promise.all(
    images.map(async (image) => {
      const editedImages = await editImage(image, prompt);

      const outputs = editedImages.editedImagesAsBase64.map(async (imageBase64, index) => {
        const result = await saveFile({
          imageBase64,
          imagePath: image.imagePath,
          outputDir,
          variationIndex: index,
        });

        return result.outputPath;
      });

      return {
        ...editedImages,
        outputs,
        imageBase64: undefined, // remove base64 from summary
      };
    })
  );

  // Save summary JSON
  await fs.promises.writeFile(
    path.join(outputDir, 'summary.json'),
    JSON.stringify({ prompt, results }, null, 2)
  );

  console.log(`Complete! Output in: ${outputDir}`);

  return outputDir;
}
