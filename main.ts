// news-image-20261121 entry, Node 22, standard library only.
//
// The submission is a finished newspaper front page, entry.png in this
// same folder, summing up the world news of Saturday 21 November 2026:
// Russian missiles landing in Poland, COP31 slipping into overtime,
// the AI sell-off pushing the S&P 500 into correction, a magnitude 6.8
// quake in central Peru, and Trump defending his Putin and Xi ties after
// the Shenzhen summit. All this program does is place that image at the
// grader's output path, so the two grading runs write identical bytes.
//
// Local check: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(destinationDir, { recursive: true });

const imageBytes = readFileSync(join(sourceDir, "entry.png"));
const destination = join(destinationDir, "entry.png");
writeFileSync(destination, imageBytes);
console.log(`wrote ${destination} (${imageBytes.length} bytes)`);
