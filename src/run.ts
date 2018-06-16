import getSource from "./getSource"
const manifest = require(process.cwd() + "/webapp/manifest.json");

require("dotenv").config();

export default () => {
  // Read all sources from manifest
  const oSources = manifest["sap.app"].dataSources,
    aSourceNames = Object.keys(oSources);

  for (const source of aSourceNames) {
    getSource(oSources[source]);
  }
};

