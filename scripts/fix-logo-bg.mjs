import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const sourcePath = path.join(publicDir, "techdigi-logo-source.png");
const logoPath = path.join(publicDir, "techdigi-logo.png");

if (!fs.existsSync(sourcePath)) {
  throw new Error(`Missing source logo: ${sourcePath}`);
}

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;

  if (r < 28 && g < 28 && b < 28) return true;
  if (max < 40 && saturation < 25) return true;
  return false;
}

const metadata = await sharp(sourcePath).metadata();
const crop = 3;
const croppedWidth = metadata.width - crop * 2;
const croppedHeight = metadata.height - crop * 2;

const { data, info } = await sharp(sourcePath)
  .extract({
    left: crop,
    top: crop,
    width: croppedWidth,
    height: croppedHeight,
  })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const pixels = Buffer.from(data);
const visited = new Uint8Array(width * height);
const queue = [];

function pushIfBackground(x, y) {
  const i = y * width + x;
  if (visited[i]) return;
  const offset = i * 4;
  if (!isBackgroundPixel(pixels[offset], pixels[offset + 1], pixels[offset + 2])) {
    return;
  }
  visited[i] = 1;
  queue.push(i);
}

for (let x = 0; x < width; x++) {
  pushIfBackground(x, 0);
  pushIfBackground(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushIfBackground(0, y);
  pushIfBackground(width - 1, y);
}

while (queue.length > 0) {
  const i = queue.shift();
  const x = i % width;
  const y = (i - x) / width;
  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    pushIfBackground(nx, ny);
  }
}

function clearBackgroundAt(i) {
  const offset = i * 4;
  pixels[offset] = 255;
  pixels[offset + 1] = 255;
  pixels[offset + 2] = 255;
  pixels[offset + 3] = 0;
}

for (let i = 0; i < width * height; i++) {
  if (!visited[i]) continue;
  clearBackgroundAt(i);
}

for (let i = 0; i < width * height; i++) {
  if (visited[i]) continue;
  const offset = i * 4;
  if (isBackgroundPixel(pixels[offset], pixels[offset + 1], pixels[offset + 2])) {
    clearBackgroundAt(i);
  }
}

const transparentLogo = await sharp(pixels, {
  raw: { width, height, channels: 4 },
})
  .png()
  .toBuffer();

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: transparentLogo, top: 0, left: 0 }])
  .trim({ threshold: 10 })
  .png()
  .toFile(logoPath);

console.log("Logo updated:", logoPath);
