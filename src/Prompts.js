import chalk from "chalk";
import fs from "fs";
import path from "path";
import { input, select } from "@inquirer/prompts";

import Validation from "./Validation.js";

class Prompts {
  constructor() {
    this.saveDir = "";
    this.allVersion = "";
    this.modloader = "";
  }

  async promptSaveDir() {
    const folderName = await input({
      message: "Enter the folder name to download the mods to:",
      required: true,
    });

    this.saveDir = path.resolve(folderName);

    try {
      if (!fs.existsSync(this.saveDir)) {
        fs.mkdirSync(this.saveDir, { recursive: true });
      }
    } catch (e) {
      console.log(chalk.red(`ERROR: An unexpected error occurred! ${chalk.dim(e.message)}`));
      process.exit(1);
    }

    return this.saveDir;
  }

  async promptAllVersion() {
    this.allVersion = await input({
      message: "Enter the version number that all the mods should be:",
      required: true,
      validate: (ver) => {
        if (Validation.validateVersion(ver)) {
          return true;
        } else {
          return "ERROR: The provided release version, pre-release or snapshot is invalid.";
        }
      },
    });
    return this.allVersion;
  }

  async promptModloader() {
    this.modloader = await select({
      message: "Select the modloader:",
      choices: [
        {
          name: "Fabric",
          value: "fabric",
        },
        {
          name: "Forge",
          value: "forge",
        },
        {
          name: "NeoForge",
          value: "neoforge",
        },
        {
          name: "Quilt",
          value: "quilt",
        },
      ],
    });

    return this.modloader;
  }
}

export default Prompts;
