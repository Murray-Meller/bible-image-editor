import 'server-only';
import fs from 'fs';
import path from 'path';

export async function saveFile(input: {
  imagePath: string;
  variationIndex?: number;
  imageBase64: string;
  outputDir: string;
}) {
  const outFilename = `edited-${path.basename(input.imagePath)}${input.variationIndex ? `-${input.variationIndex}` : ''}`;
  const outPath = path.join(input.outputDir, outFilename);

  await fs.promises.writeFile(outPath, Buffer.from(input.imageBase64, 'base64'));

  return {
    outputPath: outFilename,
  };
}
