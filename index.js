const downloadAllFromSource = require("./lib/downloadAllFromSource.js");
const manifest = require(process.cwd() + "/webapp/manifest.json");

require("dotenv").config();

const run = async () => {
  const oSources = manifest["sap.app"].dataSources,
    aSourceNames = Object.keys(oSources);

  for (const source of aSourceNames) {
    await downloadAllFromSource(oSources[source]);
  }
};

module.exports = run;
