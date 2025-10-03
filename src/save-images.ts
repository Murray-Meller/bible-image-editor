import fs from 'fs';
import path from 'path';
import { ImageEditResult } from './edit-images';

export async function saveFile(result: ImageEditResult, outputDir: string) {
  const outFilename = `edited-${path.basename(result.imagePath)}`;
  const outPath = path.join(outputDir, outFilename);

  await fs.promises.writeFile(outPath, Buffer.from(result.imageBase64, 'base64'));

  return {
    ...result,
    output: outFilename,
  };
}
