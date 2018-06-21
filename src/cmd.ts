#!/usr/bin/env node
import flags from "flags";
import { Params } from "./interfaces";

flags.defineString("language");
flags.defineInteger("client");
flags.defineString("protocol");
flags.parse();

const params: Params = {
  language: flags.get("language"),
  client: flags.get("client"),
  protocol: flags.get("protocol")
};

import run from "./run";
run(params);
