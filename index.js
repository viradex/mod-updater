#!/usr/bin/env node

const chalk = require("chalk");

const Config = require("./src/Config");
const configFile = new Config();

console.log(chalk.bold.underline("Minecraft Mod Updater\n"));

if (!configFile.configExists()) {
  process.exit(1);
}
