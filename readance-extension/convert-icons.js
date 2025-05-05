import fs from "fs";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertSvgToPng(input, output, size) {
  console.log(`Converting ${input} to ${output} with size ${size}x${size}`);
  try {
    const svgBuffer = await fs.promises.readFile(input);
    await sharp(svgBuffer).resize(size, size).png().toFile(output);
    console.log(`Successfully created ${output}`);
  } catch (error) {
    console.error(`Error converting ${input} to ${output}:`, error);
  }
}

async function main() {
  const sizes = [16, 48, 128];
  const iconsDir = path.join(__dirname, "public", "icons");

  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon${size}.svg`);
    const pngPath = path.join(iconsDir, `icon${size}.png`);
    await convertSvgToPng(svgPath, pngPath, size);
  }
}

main().catch(console.error);
