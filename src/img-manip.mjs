import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import ora from "ora";

/**
 * Parses a comma-separated list of file extensions and normalizes them.
 *
 * @param {string} exts - A comma-separated string of file extensions (e.g., "txt,js,.json").
 * @returns {string[]} - An array of normalized file extensions (e.g., [".txt", ".js", ".json"]).
 */
const parseExtensions = (exts) =>
  exts
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length)
    .map((e) => (e.startsWith(".") ? e : `.${e}`));

/**
 * Parse a source string.
 * @todo Handle recursive?
 * @param {string} source - The directory to search in.
 * @param {string} exts - The file extension to filter by (e.g., "png,jpg").
 * @param {import('ora').Ora} [spinner] - Ora spinner instance
 * @returns {Promise<string[]>} - A list of matching file paths.
 */
const parseFileSources = async (source, exts, spinner = { text: "", fail: () => {} }) => {
  spinner.text = "Parse source string";

  const results = [];
  const dir = process.cwd();
  if (source === ".") {
    try {
      const extensions = parseExtensions(exts);
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile() && extensions.includes(path.extname(fullPath))) results.push(fullPath);
      }
    } catch (e) {
      spinner.fail(`Failed getting all img files in "${dir}"`);
      console.error(e);
      return null;
    }
  } else {
    const entries = source
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      try {
        const file = await fs.stat(fullPath);
        if (file.isFile()) results.push(fullPath);
      } catch (e) {
        spinner.fail(`"${entry}" not found in "${dir}"`);
        console.error(e);
        return null;
      }
    }
  }

  return results;
};

/**
 * Converts image sources to webp
 *
 * @param {string} source - Comma separated source files or "." for all in the current folder.
 * @param {Object} opts - Options.
 * @param {string} opts.exts - A comma-separated string of file extensions.
 * @param {string} [opts.out] - An optional output directory.
 * @returns {Promise<void>}
 */
export const toWebp = async (source, opts) => {
  let spinner = ora().start("Converting image(s)");
  const files = await parseFileSources(source, opts.exts, spinner);
  if (!files) return;
  if (!files.length) {
    spinner.warn("No files found");
    return;
  }

  spinner.succeed(`Found ${files.length} image(s).`);
  spinner = ora().start("Converting files.");

  const outDir = path.resolve(process.cwd(), opts.out);
  await fs.mkdir(outDir, { recursive: true });

  for (const file of files) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const outPath = path.join(outDir, `${baseName}.webp`);

    spinner.text = `Converting "${baseName}${ext}"`;
    try {
      await sharp(file).webp({ quality: 100 }).toFile(outPath);
    } catch (e) {
      spinner.fail(`Failed to convert "${file}"`);
      console.error(e);
      return;
    }
  }

  spinner.succeed(`Converted ${files.length} image(s).`);
};
