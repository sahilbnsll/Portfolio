import sharp from "sharp";
import { mkdirSync } from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, "public", "avatar-source.png");
const PUBLIC = path.join(ROOT, "public");

async function main() {
  // Original avatar art has large transparent padding around the silhouette.
  // Trim it to the artwork's true bounding box, then re-pad to a square
  // canvas with a small, consistent safe margin so the mark fills the
  // favicon area edge-to-edge instead of floating in a sea of transparency.
  const trimmed = sharp(SRC).trim({ threshold: 10 });
  const trimmedBuffer = await trimmed.toBuffer();
  const meta = await sharp(trimmedBuffer).metadata();
  console.log("trimmed size:", meta.width, meta.height);

  const side = Math.max(meta.width, meta.height);
  const margin = Math.round(side * 0.025); // ~2.5% safe margin — mark fills nearly the whole canvas
  const canvas = side + margin * 2;

  const squared = await sharp(trimmedBuffer)
    .resize(side, side, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: margin,
      bottom: margin,
      left: margin,
      right: margin,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const squaredMeta = await sharp(squared).metadata();
  console.log("squared canvas:", squaredMeta.width, squaredMeta.height);

  const targets = [
    { file: "icon-16.png", size: 16 },
    { file: "icon-32.png", size: 32 },
    { file: "icon-48.png", size: 48 },
    { file: "icon-192.png", size: 192 },
    { file: "icon-512.png", size: 512 },
    { file: "icon.png", size: 512 },
  ];

  for (const t of targets) {
    await sharp(squared)
      .resize(t.size, t.size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC, t.file));
    console.log("wrote", t.file);
  }

  // Apple touch icon: no alpha transparency (iOS ignores/flattens it
  // inconsistently), so composite onto a solid background matching the
  // site's dark theme.
  await sharp(squared)
    .resize(180, 180, { fit: "cover" })
    .flatten({ background: "#0a0a0a" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("wrote apple-touch-icon.png");

  // Maskable icon for PWA manifest (needs extra safe-zone padding so
  // Android's circular/rounded mask doesn't clip the artwork).
  const maskableMargin = Math.round(squaredMeta.width * 0.18);
  await sharp(squared)
    .resize(squaredMeta.width, squaredMeta.height)
    .extend({
      top: maskableMargin,
      bottom: maskableMargin,
      left: maskableMargin,
      right: maskableMargin,
      background: "#0a0a0a",
    })
    .resize(512, 512, { fit: "cover" })
    .flatten({ background: "#0a0a0a" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "icon-512-maskable.png"));
  console.log("wrote icon-512-maskable.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
