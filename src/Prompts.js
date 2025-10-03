const chalk = require("chalk");
const { question } = require("readline-sync");
const fs = require("fs");
const path = require("path");

class Prompts {
  constructor() {
    this.saveDir = "";
    this.allVersion = "";
    this.modloader = "";
  }

  promptSaveDir() {
    this.saveDir = path.resolve(question(`Enter the folder name to download the mods to: `));

    try {
      if (!fs.existsSync(this.saveDir)) {
        fs.mkdirSync(this.saveDir);
      }
    } catch (e) {
      console.log(chalk.red(`ERROR: An unexpected error occurred! ${chalk.dim(e.message)}`));
    }

    return this.saveDir;
  }

  promptAllVersion() {
    this.allVersion = question("Enter the version number that all the mods should be: ");
    return this.allVersion;
  }

  promptModloader() {
    this.modloader = question("Enter the modloader: ").toLowerCase();
    return this.modloader;
  }
}

module.exports = Prompts;
