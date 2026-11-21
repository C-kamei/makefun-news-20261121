// news-image-20261121 entry, Node 22, standard library only.
//
// The submission is a finished newspaper front page, entry.png in this
// same folder, summing up the world news of Saturday 21 November 2026:
// Russian missiles landing in Poland, COP31 slipping into overtime,
// the AI sell-off pushing the S&P 500 into correction, a magnitude 6.8
// quake in central Peru, and Trump defending his Putin and Xi ties after
// the Shenzhen summit. All this program does is place that image at the
// grader's output path, so the two grading runs write identical bytes.
// Before writing, it validates the image against the competition limits
// (PNG or JPEG by magic bytes, at most 1 MiB, PNG dimensions at most
// 1024x1024) and refuses to write anything that fails those checks.
//
// Local check: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576; // 1 MiB
const MAX_DIMENSION = 1024;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function validateImage(bytes) {
  if (bytes.length > MAX_BYTES) {
    throw new Error(`image is ${bytes.length} bytes, over the ${MAX_BYTES}-byte limit`);
  }
  const isPng =
    bytes.length >= PNG_SIGNATURE.length &&
    PNG_SIGNATURE.every((b, i) => bytes[i] === b);
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isPng && !isJpeg) {
    throw new Error("image is neither PNG nor JPEG (unrecognised magic bytes)");
  }
  if (isPng) {
    // IHDR is the first chunk: length at 8, type at 12, width at 16, height at 20.
    if (bytes.length < 24 || bytes.toString("ascii", 12, 16) !== "IHDR") {
      throw new Error("PNG has no IHDR chunk where one is required");
    }
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      throw new Error(`PNG is ${width}x${height}, over the ${MAX_DIMENSION}x${MAX_DIMENSION} limit`);
    }
  }
}

const sourceDir = dirname(fileURLToPath(import.meta.url));
const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(destinationDir, { recursive: true });

const imageBytes = readFileSync(join(sourceDir, "entry.png"));
validateImage(imageBytes);
const destination = join(destinationDir, "entry.png");
writeFileSync(destination, imageBytes);
console.log(`wrote ${destination} (${imageBytes.length} bytes)`);
