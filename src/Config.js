import chalk from "chalk";
import fs from "fs";
import os from "os";
import axios from "axios";
import path from "path";
import { input, confirm, expand, checkbox } from "@inquirer/prompts";

import pressAnyKey from "./helper/pressAnyKey.js";
import sleep from "./helper/sleep.js";
import sortNestedObjects from "./helper/sortNestedObjects.js";

class Config {
  constructor() {
    this.filename = path.resolve(os.homedir(), "mcmods-config.json");
  }

  async #modInfoPrompts() {
    const name = (
      await input({
        message: chalk.bold("Enter mod name (as in the URL):"),
        transformer: (val) => val.toLowerCase(),
        required: true,
      })
    ).toLowerCase();

    let projectID = "";
    try {
      projectID = (await axios.get(`https://api.modrinth.com/v2/project/${name}/version`)).data[0]
        .project_id;
    } catch (e) {
      console.log();
      if (e.response && e.response.status === 404) {
        console.log(chalk.red(`ERROR: The mod does not exist! Continuing...`));
      } else {
        console.log(
          chalk.red(`ERROR: An unexpected error occurred! ${chalk.dim(e.message)}\nContinuing...`)
        );
      }

      await sleep(2500);
      return false;
    }

    const filename = await input({
      message: "Enter the filename of the downloaded mod file (optional):",
    });

    console.log(
      chalk.yellow(
        `\nThis is the mod URL that will be saved, please ensure it is correct: https://modrinth.com/mod/${projectID}`
      )
    );

    return { name, projectID, filename };
  }

  async #addModEntry(useExistingConfig) {
    let modEntries = [];
    if (useExistingConfig) modEntries = JSON.parse(fs.readFileSync(this.filename, "utf-8"));

    while (true) {
      const modInfo = await this.#modInfoPrompts();
      if (!modInfo) continue;
      const { name, projectID, filename } = modInfo;

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
            name: "Discard only this mod entry",
            value: "discard",
          },
          {
            key: "s",
            name: "Save config file",
            value: "save",
          },
          {
            key: "x",
            name: "Abort and discard all mod entries",
            value: "abort",
          },
        ],
      });

      if (answer === "continue" || answer === "save") {
        modEntries.push({
          projectID,
          name,
          filename: filename ? filename + ".jar" : "",
        });

        if (answer === "save") {
          break;
        }
      } else if (answer === "discard") {
        continue;
      } else if (answer === "abort") {
        return;
      }
    }

    modEntries = sortNestedObjects(modEntries);

    fs.writeFileSync(this.filename, JSON.stringify(modEntries), "utf-8");
    console.log(chalk.green(`Config file '${this.filename}' successfully saved!\n`));
  }

  async #selectMods(message) {
    const config = this.getConfig();
    const selections = config.map(({ projectID, name, filename }) => {
      const cleanName = filename ? filename.replace(/\.jar$/i, "") : "";
      return {
        name: cleanName ? `${cleanName} (${name.toLowerCase()})` : name,
        value: projectID,
      };
    });

    const choices = await checkbox({
      message,
      required: true,
      choices: selections,
    });
    return choices;
  }

  #removeMods(modsToRemove) {
    const config = this.getConfig();
    const updated = config.filter((obj) => !modsToRemove.includes(obj.projectID));

    return updated;
  }

  async configFileLocation(fileLocation) {
    if (!fileLocation) {
      fileLocation = await input({
        message:
          "Enter the location (including the name) of the config file, or where to create it if it doesn't exist:",
        default: this.filename,
        required: true,
      });
    }

    this.filename = fileLocation;
  }

  configExists() {
    if (!fs.existsSync(this.filename)) return false;
    if (!this.getConfig().length) return false;
    return true;
  }

  getConfig() {
    if (!fs.existsSync(this.filename)) return [];
    return JSON.parse(fs.readFileSync(this.filename, "utf-8"));
  }

  async createConfig(manuallySelected = true) {
    console.log(chalk.bold.underline.blue("Auto Config Maker"));

    if (manuallySelected)
      console.log("The config file will help the program to determine what mods to update!");
    else console.log("We detected that you don't have a config file yet, so let's make one!");
    console.log(chalk.dim("Refer to the docs for help on where to get specific data.\n"));

    await pressAnyKey("Press any key to continue . . .", false);

    await this.#addModEntry(false);
  }

  async updateConfig() {
    const action = await expand({
      message: "What would you like to do?",
      expanded: true,
      choices: [
        {
          key: "a",
          name: "Add new mods",
          value: "add",
        },
        {
          key: "c",
          name: "Change existing mods",
          value: "change",
        },
        {
          key: "d",
          name: "Delete mods",
          value: "delete",
        },
        {
          key: "x",
          name: "Exit",
          value: "exit",
        },
      ],
    });

    if (action === "add") {
      await this.#addModEntry(true);
      return;
    } else if (action === "change") {
      const selections = await this.#selectMods("What mods would you like to change?");
      const fullConfig = this.getConfig();
      const modifiedConfig = this.#removeMods(selections);

      const removed = fullConfig.filter(
        (fullItem) => !modifiedConfig.some((modItem) => modItem.projectID === fullItem.projectID)
      );

      const modEntries = [];
      for (const mod of removed) {
        const prettyName = mod.filename
          ? `${mod.filename.replace(/\.jar$/i, "")} (${mod.name})`
          : mod.name;
        console.log(chalk.underline.bold(`Editing ${prettyName}\n`));

        const modInfo = await this.#modInfoPrompts();
        if (!modInfo) continue;
        const { name, projectID, filename } = modInfo;

        const confirmation = await confirm({
          message: "Are you sure you want to change this mod?",
        });

        if (confirmation) {
          modEntries.push({
            projectID,
            name,
            filename: filename ? filename + ".jar" : "",
          });
        }
      }

      const edited = sortNestedObjects([...modifiedConfig, ...modEntries]);
      fs.writeFileSync(this.filename, JSON.stringify(edited), "utf-8");
      console.log(chalk.green(`Successfully edited mods!\n`));
    } else if (action === "delete") {
      const selections = await this.#selectMods("What mods would you like to delete?");
      const modifiedConfig = this.#removeMods(selections);

      const confirmation = await confirm({
        message: "Are you sure you want to delete the selected mods?",
      });

      if (confirmation) {
        fs.writeFileSync(this.filename, JSON.stringify(modifiedConfig), "utf-8");
        console.log(chalk.green("Deleted the selected mods from the config file!"));
      } else {
        console.log(chalk.yellow("Left the config file as-is."));
      }
    }
  }

  async deleteConfig() {
    const confirmation = await confirm({
      message: `Are you sure you want to delete the config file '${path.resolve(this.filename)}'?`,
    });

    if (confirmation) {
      fs.rmSync(this.filename);
      console.log(chalk.green("Successfully deleted."));
    } else {
      console.log(chalk.yellow("Left the config file as-is."));
    }
  }
}

export default Config;
