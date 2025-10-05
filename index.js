#!/usr/bin/env node

import chalk from "chalk";

console.log(chalk.bold.underline("Minecraft Mod Updater"));
console.log(chalk.dim("Loading, please wait...\n"));

const arg = process.argv[2];
const data = {
  saveDir: "",
  allVersion: "",
  modloader: "",
};

import Config from "./src/Config.js";
const config = new Config();

import Prompts from "./src/Prompts.js";
const prompts = new Prompts();

import downloader from "./src/downloader.js";

if (!config.configExists(false)) {
  await config.createConfig(false);
}

if (arg === "-create") {
  await config.createConfig(true);
  process.exit(0);
} else if (arg === "-update") {
  await config.updateConfig();
  process.exit(0);
} else if (arg === "-delete") {
  await config.deleteConfig();
  process.exit(0);
}

console.log(chalk.bold.underline.blue("Initial Information"));
data.saveDir = await prompts.promptSaveDir();
data.allVersion = await prompts.promptAllVersion();
data.modloader = await prompts.promptModloader();

await downloader(data.saveDir, data.allVersion, data.modloader);
