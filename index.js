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

if (!config.configExists()) {
  process.exit(1);
}

data.saveDir = prompts.promptSaveDir();
Object.assign(data, prompts.promptModInfo());

console.log(data);
