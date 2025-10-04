import 'server-only';
import fs from 'fs';
import path from 'path';

export async function saveFile(input: {
  imagePath: string;
  variationIndex?: number;
  imageBase64: string;
  outputDir: string;
}) {
  const ext = path.extname(input.imagePath);
  const outFilename = `edited-${path.basename(input.imagePath, ext)}${input.variationIndex ? `-${input.variationIndex}` : ''}${ext}`;
  const outputPath = path.join(input.outputDir, outFilename);

  await fs.promises.writeFile(outputPath, Buffer.from(input.imageBase64, 'base64'));

  return {
    outputPath,
  };
}
