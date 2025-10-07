import chalk from "chalk";
import path from "path";
import axios from "axios";

import downloadFile from "./helper/downloadFile.js";

const downloader = async (folder, version, modloader, configClass) => {
  folder = path.resolve(folder);

  const config = configClass.getConfig();
  if (!config.length) {
    console.log(chalk.red("ERROR: Unable to find config file."));
    process.exit(1);
  }

  try {
    // forEach doesn't support async functions well
    for (const mod of config) {
      const { data } = await axios.get(
        `https://api.modrinth.com/v2/project/${mod.projectID}/version`
      );
      const matchingVersion = data.find((val) => {
        return val.game_versions.includes(version) && val.loaders.includes(modloader);
      });

      if (!matchingVersion) {
        console.log(
          chalk.yellow(`No matching version or modloader found for mod '${mod.name}', skipping...`)
        );
        continue;
      }

      process.stdout.write(
        `Downloading version '${matchingVersion.version_number}' of mod '${mod.name}'... `
      );

      await downloadFile(
        matchingVersion.files[0].url,
        mod.filename
          ? path.join(folder, mod.filename)
          : path.join(folder, matchingVersion.files[0].filename)
      );

      process.stdout.write(chalk.bold.green("DONE!\n"));
    }
  } catch (e) {
    console.log(chalk.red(`ERROR: An unexpected error occurred! ${chalk.dim(e.message)}`));
    process.exit(1);
  }
};

export default downloader;
