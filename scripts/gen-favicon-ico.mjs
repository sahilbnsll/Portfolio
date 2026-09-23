import { readFileSync, writeFileSync } from "fs";
import path from "path";

// Minimal ICO container packing PNG-compressed frames (supported by all
// modern browsers/OSes). Avoids needing a native BMP encoder.
const ROOT = process.cwd();
const sizes = [16, 32, 48];
const pngBuffers = sizes.map((s) =>
  readFileSync(path.join(ROOT, "public", `icon-${s}.png`)),
);

const headerSize = 6;
const dirEntrySize = 16;
const offsets = [];
let offset = headerSize + dirEntrySize * sizes.length;
for (const buf of pngBuffers) {
  offsets.push(offset);
  offset += buf.length;
}

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4); // count

const dirEntries = sizes.map((size, i) => {
  const entry = Buffer.alloc(dirEntrySize);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffers[i].length, 8); // size of image data
  entry.writeUInt32LE(offsets[i], 12); // offset
  return entry;
});

const ico = Buffer.concat([header, ...dirEntries, ...pngBuffers]);
writeFileSync(path.join(ROOT, "public", "favicon.ico"), ico);
console.log("wrote favicon.ico", ico.length, "bytes containing sizes", sizes);
