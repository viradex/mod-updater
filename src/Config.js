import chalk from "chalk";
import fs from "fs";

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
}

export default Config;
