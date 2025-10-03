#!/usr/bin/env node

const chalk = require("chalk");
console.log(chalk.bold.underline("Minecraft Mod Updater"));
console.log(chalk.dim("Loading, please wait...\n"));

const data = {
  saveDir: "",
  allVersion: "",
  modloader: "",
};

const Config = require("./src/Config");
const config = new Config();

const Prompts = require("./src/Prompts");
const prompts = new Prompts();

const Validation = require("./src/Validation");

if (!config.configExists()) {
  process.exit(1);
}

console.log(chalk.bold.underline.blue("Initial Information"));
data.saveDir = prompts.promptSaveDir();

data.allVersion = prompts.promptAllVersion();
while (!Validation.validateVersion(data.allVersion)) {
  console.log(
    chalk.red("ERROR: The provided release version, pre-release or snapshot was invalid.\n")
  );

  data.allVersion = prompts.promptAllVersion();
}

data.modloader = prompts.promptModloader();
while (!Validation.validateModloader(data.modloader)) {
  console.log(
    chalk.red(
      "ERROR: The provided modloader was invalid. Accepted values are 'fabric', 'forge', 'neoforge', or 'quilt'.\n"
    )
  );

  data.modloader = prompts.promptModloader();
}
