#!/usr/bin/env node
import program from "commander";
import { Params } from "./interfaces";
const version = require("../package.json").version;

program
  .version(version)
  .option("-l, --language <language>", "language code", "EN")
  .option("-c, --client <client>", "client number", "200")
  .option(
    "-p, --protocol <protocol>",
    "protocol: http or https",
    /^(http|https)$/i,
    "https"
  )
  .option("-d, --app-dir <dir>", "app directory", "webapp")
  .parse(process.argv);

console.log(
  `Using: language '${program.language}', client '${
    program.client
  }', protocol '${program.protocol}' and app directory '${program.appDir}'`
);

const params: Params = {
  language: program.language,
  client: program.client,
  protocol: program.protocol,
  appDir: program.appDir
};

import run from "./run";
run(params);
