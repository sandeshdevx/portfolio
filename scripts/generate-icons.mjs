import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const source = await readFile(path.join(publicDir, 'favicon.svg'));
const background = '#0a0b09';

const icon = (size, flatten = true) => {
  let pipeline = sharp(source, { density: 384 }).resize(size, size);
  if (flatten) pipeline = pipeline.flatten({ background });
  return pipeline.png();
};

await icon(180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
await icon(192).toFile(path.join(publicDir, 'android-chrome-192x192.png'));
await icon(512).toFile(path.join(publicDir, 'android-chrome-512x512.png'));

const faviconPng = await icon(32).toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(32, 6);
icoHeader.writeUInt8(32, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);

await writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([icoHeader, faviconPng]));

console.log('Generated favicon.ico, apple-touch-icon.png and Android icons from public/favicon.svg.');
