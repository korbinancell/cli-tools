#!/usr/bin/env node

import { program } from "commander";
import clipboard from "clipboardy";
import { resizeImg, toWebp } from "./src/img-manip.mjs";
import { toSmallCaps, toSmallText, toUpsideDown, zalgoize } from "./src/text-generator.mjs";
import { parseCssColor } from "./src/colors.mjs";

const doTextThing = (fn) => (text, opts) => {
  const out = fn(text, opts);
  console.log(out);

  if (!opts.skipCopy) clipboard.writeSync(out);
};

const doTimedThing = (fn) => async (cmd, opts) => {
  console.time("done");
  await fn(cmd, opts);
  console.timeEnd("done");
};

/**
 * Colors
 */
program
  .command("color")
  .argument("<color>", "css formatted color (hex, rgb, hsl)")
  .description("converts a css color to the different formats")
  .action((color) => console.table(parseCssColor(color)));

/**
 * Img manip
 */
program
  .command("webp")
  .argument("<source>", 'comma separated source files or "." for all in a folder')
  .option("--out <text>", "output folder", ".")
  .option("-e, --exts", "img extensions", "png,jpg")
  .description("converts images to webp")
  .action(doTimedThing(toWebp));

program
  .command("resize")
  .argument("<source>", 'comma separated source files or "." for all in a folder')
  .option("--out <text>", "output folder", "./resized")
  .option("-e, --exts", "img extensions", "webp")
  .option("-w, --width <number>", "300")
  .option("-h, --height <number>", "300")
  .description("resizes images")
  .action(doTimedThing(resizeImg));

/**
 * For fun
 */
program
  .command("small <text>")
  .description("smallize text")
  .option("--skip-copy", "skip copying to clipboard automatically", false)
  .action(doTextThing(toSmallText));

program
  .command("smallcap")
  .alias("sc")
  .argument("<text>")
  .description("text to small caps")
  .option("--skip-copy", "skip copying to clipboard automatically", false)
  .action(doTextThing(toSmallCaps));

program
  .command("upsidedown")
  .alias("ud")
  .argument("<text>")
  .description("flip text upside down")
  .option("--skip-copy", "skip copying to clipboard automatically", false)
  .action(doTextThing(toUpsideDown));

program
  .command("zalgoize")
  .alias("z")
  .argument("<text>")
  .description("scary text")
  .option("-i, --intensity <number>", "zalgo intensity (0, 1]", 0.5)
  .option("--skip-copy", "skip copying to clipboard automatically", false)
  .action(doTextThing((text, opts) => zalgoize(text, opts.intensity)));

await program.parseAsync();
