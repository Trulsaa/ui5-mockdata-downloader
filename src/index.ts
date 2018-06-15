import downloadAllFromSource from "./downloadAllFromSource";
const manifest = require(process.cwd() + "/webapp/manifest.json");

require("dotenv").config();

const run = async () => {
  const sources = manifest["sap.app"].dataSources,
    sourceNames = Object.keys(sources);

  for (const source of sourceNames) {
    await downloadAllFromSource.downloadAllFromSource(sources[source]);
  }
};

module.exports = run;
