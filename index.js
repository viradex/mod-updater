#!/usr/bin/env node

import chalk from "chalk";

console.log(chalk.bold.underline("Minecraft Mod Updater"));
console.log(chalk.dim("Loading, please wait...\n"));

const data = {
  saveDir: "",
  allVersion: "",
  modloader: "",
};

import Config from "./src/Config.js";
const config = new Config();

import Prompts from "./src/Prompts.js";
const prompts = new Prompts();

if (!config.configExists()) {
  await config.createConfig();
  process.exit(0); // TODO make it continue code after config made, this is for debug
}

console.log(chalk.bold.underline.blue("Initial Information"));
data.saveDir = await prompts.promptSaveDir();
data.allVersion = await prompts.promptAllVersion();
data.modloader = await prompts.promptModloader();
