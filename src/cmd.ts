#!/usr/bin/env node
import program from "commander";

import { Params } from "./interfaces";
import Prompter from "./Prompter";
import run from "./run";

require("dotenv").config();

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

const prompter = Prompter();

(async () => {
  const params: Params = {
    language: program.language,
    client: program.client,
    protocol: program.protocol,
    appDir: program.appDir,
    username: process.env.SAPUSERNAME,
    password: process.env.SAPPASSWORD,
    domainName: process.env.SAPDOMAINNAME
  };

  if (!params.username) {
    params.username = await prompter.ask("SAP Username: ");
  }
  if (!params.password) {
    params.password = await prompter.mute().ask("SAP password: ");
  }
  if (!params.domainName) {
    params.domainName = await prompter.ask("SAP domain name: ");
  }

  run(params);
})();
