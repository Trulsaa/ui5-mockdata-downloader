import { Counters } from "./interfaces";
import getSource from "./getSource";
const manifest = require(process.cwd() + "/webapp/manifest.json");

require("dotenv").config();

export default async () => {
  // Start timer
  console.time("");

  // Read all sources from manifest
  const oSources = manifest["sap.app"].dataSources,
    aSourceNames = Object.keys(oSources);

  let sourcePromises = [];
  const start = process.hrtime();
  for (const source of aSourceNames) {
    sourcePromises.push(getSource(oSources[source]));
  }
  const counters = await Promise.all(sourcePromises);

  const totalCount = counters.reduce(
    (sum, counters) => {
      sum.files = sum.files + counters.files;
      sum.downloads = sum.downloads + counters.downloads;
      return sum;
    },
    { files: 0, downloads: 0 }
  );

  console.log(
    `Downloaded ${totalCount.downloads} files and merged them into ${
      totalCount.files
    } that were written to disk in `
  );
  console.timeEnd("");
};
