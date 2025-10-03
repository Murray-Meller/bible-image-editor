import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getImages } from './get-images';
import { editImage } from './edit-images';
import { saveFile } from './save-images';

const INPUT_DIR = process.env.INPUT_DIR || 'sample_images';
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'ouput';
const PROMPT = process.env.PROMPT ?? '';

if (!PROMPT) {
  throw new Error('Please set the PROMPT environment variable in your .env file');
}

const INPUT_BASE = path.join(__dirname, `../${INPUT_DIR}`);
const OUTPUT_BASE = path.join(__dirname, `../${OUTPUT_DIR}`);

async function main() {
  // Prepare output directory
  const timestamp = new Date().toISOString();

  const outputDir = path.join(OUTPUT_BASE, timestamp);
  await fs.promises.mkdir(outputDir, { recursive: true });

  console.log(`Using prompt: "${PROMPT}"`);
  console.log(`Input dir: "${INPUT_BASE}"`);
  console.log(`Output dir: "${outputDir}"`);

  const images = await getImages(INPUT_BASE);

  const results = await Promise.all(
    images.map(async (image) => {
      const editedImage = await editImage(image, PROMPT);

      const savedResult = editedImage ? await saveFile(editedImage, outputDir) : editedImage;

      return { ...editImage, imageBase64: undefined, output: savedResult?.output };
    })
  );

  // Save summary JSON
  await fs.promises.writeFile(
    path.join(outputDir, 'summary.json'),
    JSON.stringify({ prompt: PROMPT, results }, null, 2)
  );
  console.log(`All done! Output in: ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
