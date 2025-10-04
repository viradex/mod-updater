import chalk from "chalk";
import fs from "fs";
import axios from "axios";
import { input, expand } from "@inquirer/prompts";

import pressAnyKey from "./helper/pressAnyKey.js";

class Config {
  constructor() {
    this.filename = "config.json";
  }

  configExists() {
    if (!fs.existsSync(this.filename)) {
      console.log(
        chalk.red(
          `ERROR: The required file '${this.filename}' does not exist in the current working directory. Please ensure the file exists and try again.\nIf you haven't yet made the file, refer to the documentation for how to make it.`
        )
      );
      return false;
    }
    return true;
  }

  async createConfig() {
    process.stdout.write("\x1bc");
    console.log(chalk.bold.underline.blue("Auto Config Maker"));
    console.log("This program will automatically create the configuration for the mod updater.");
    console.log(chalk.dim("Refer to the documentation for help on where to get specific data.\n"));

    await pressAnyKey("Press any key to continue . . .", false);

    let continueAdding = true;
    while (continueAdding) {
      process.stdout.write("\x1bc");

      const name = await input({
        message: chalk.bold("Enter mod name (as in the URL):"),
        transformer: (val) => val.toLowerCase(),
        required: true,
      });

      let projectID = "";
      try {
        projectID = (await axios.get(`https://api.modrinth.com/v2/project/${name}/version`)).data[0]
          .project_id;
      } catch (e) {
        console.log();
        if (e.response && e.response.status === 404) {
          console.log(chalk.red(`ERROR: The mod does not exist!`));
        } else {
          console.log(chalk.red(`ERROR: An unexpected error occurred! ${chalk.dim(e.message)}`));
        }

        await pressAnyKey("Press any key to continue . . .", false);
        continue;
      }

      const filename = await input({
        message: "Enter the filename of the downloaded mod file (optional):",
      });

      console.log();
      console.log(
        chalk.yellow(
          `This is the mod URL that will be saved, please ensure it is correct: https://modrinth.com/mod/${projectID}`
        )
      );
      const answer = await expand({
        message: "What would you like to do?",
        default: "y",
        choices: [
          {
            key: "y",
            name: "Continue",
            value: "continue",
          },
          {
            key: "n",
            name: "Discard only this mod",
            value: "discard",
          },
          {
            key: "x",
            name: "Abort and discard all mods",
            value: "abort",
          },
        ],
      });

      // TODO add actual functions
      if (answer === "continue") {
        continueAdding = true;
      } else if (answer === "discard") {
        continueAdding = true;
      } else {
        continueAdding = false;
      }
    }
  }
}

export default Config;
