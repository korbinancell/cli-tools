import fs from "node:fs/promises";
import path from "node:path";
import ora from "ora";

export const dataSize = (str) => Math.round(new Blob([str]).size / 1024);

/**
 * Reads all JSON files in a directory and combines them into an array.
 *
 * @param {string} dirPath - The directory containing JSON files.
 * @param {string} [outPath] - Out path. Defaults to "./output.json".
 * @returns {Promise<{totalFiles: number, dataSize: string}>} - Stats
 * @todo allow for filter regex
 */
export const combineJsonFiles = async (dirPath, outPath = ".") => {
  dirPath = path.resolve(process.cwd(), dirPath);
  outPath = path.resolve(process.cwd(), outPath);

  const outputPath = path.join(outPath, "output.json");
  const statsPath = path.join(outPath, "stats.json");

  let spinner = ora().start(`Reading dir at "${dirPath}"`);
  const output = [];
  const stats = { totalFiles: 0, dataSize: 0 };
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files.filter((f) => f.endsWith(".json"))) {
      const filePath = path.join(dirPath, file);
      spinner.text = `Reading file at "${filePath}".`;
      try {
        const buffer = await fs.readFile(filePath);
        const data = JSON.parse(new TextDecoder("utf8", { ignoreBOM: false }).decode(buffer));
        output.push(data);
      } catch (e) {
        spinner.fail();
        console.error(e);
      }
    }
  } catch (e) {
    spinner.fail();
    console.error(e);
  }

  spinner.succeed(`Read ${output.length} files.`);
  spinner = ora().start("Writing output files");
  const data = JSON.stringify(output, null, 2);
  stats.totalFiles = output.length;
  stats.dataSize = `${dataSize(data)} KB`;

  await fs.mkdir(outPath, { recursive: true });
  await fs.writeFile(outputPath, data);
  await fs.writeFile(statsPath, JSON.stringify(stats, null, 2));
  spinner.succeed(`Combined ${output.length} files. See "${statsPath}"`);

  return stats;
};
