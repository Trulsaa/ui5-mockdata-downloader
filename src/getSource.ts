import {
  Counters,
  RawSource,
  ParsedXML,
  NavigationMap,
  Params
} from "./interfaces";
import { pd } from "pretty-data";

import files from "./files";
import download from "./download";
import parse from "./parse";
import api from "./api";

export default async function(source: RawSource, params: Params) {
  const counters: Counters = {
    downloads: 0,
    files: 0
  };

  // Parse source
  const parsedSource = parse.source(source);

  // Download metadata.xml
  const metadataFile = await api.getMetadata(parsedSource, params);
  counters.downloads++;

  // parse metadata file into JSON
  const metadataJSON = parse.XML(metadataFile.file);

  let entitySets, navigationMap: NavigationMap;
  if (metadataJSON) {
    // Describe all sets
    entitySets = parse.entitySet(metadataJSON);
    // Describe all NavigationPropertys
    navigationMap = parse.associationMap(metadataJSON);
  } else {
    console.log(`metadataJSON is ${metadataJSON}`);
  }

  // Download all sets
  let entitySetFiles;
  if (entitySets) {
    entitySetFiles = await api.getEntitySets(entitySets, parsedSource, params);
  } else {
    console.log(`entitySets is ${entitySets}`);
  }
  counters.downloads = counters.downloads + entitySetFiles.length;

  // Get all Navigations and add type
  let navigations;
  if (entitySetFiles) {
    navigations = parse
      .navigations(entitySetFiles)
      .map((nav: { name: string; url: string }) => {
        return {
          name: nav.name,
          url: nav.url,
          set: parse.setFromNavMap(navigationMap, nav)
        };
      });
  }

  // Download all navigations
  const navigationFiles = await api.getNavigationSets(
    navigations,
    parsedSource,
    params
  );
  counters.downloads = counters.downloads + navigationFiles.length;

  // Combine the sets and remove duplicates
  let allFiles: any[], allSets, combinedFiles, uniqueCombinedFiles;
  if (entitySetFiles) {
    allFiles = [...navigationFiles, ...entitySetFiles];
    allSets = [...new Set(allFiles.map(item => item.name))];

    combinedFiles = allSets.map(set => {
      const setFiles = allFiles
        .filter(file => file.name === set)
        .map(file => file.file);
      return {
        name: set,
        file: files.reduceFilesToOne(setFiles)
      };
    });
    uniqueCombinedFiles = combinedFiles.map(file => {
      return {
        name: file.name,
        // file: { d: { results: [...new Set(file.file.d.results)] } }
        file: { d: { results: files.removeDuplicates(file.file.d.results) } }
      };
    });
  }

  //
  // Write files
  //
  // Create dir to store all source files
  const localUriParsed = parse.localUri(
    parsedSource.settings.localUri,
    params.appDir
  );
  await files.createDirIfNonExistant(localUriParsed).catch(function(err) {
    console.log("Unable to create directorys");
    console.error(err);
    process.exit(1);
  });
  counters.files++;

  // save metadata.xml
  files
    .writeToFile({
      content: pd.xml(metadataFile.file),
      folderPath: localUriParsed,
      name: "metadata",
      filetype: "xml"
    })
    .catch(function(err) {
      console.log("Unable to save metadata file");
      console.error(err);
      process.exit(1);
    });

  if (uniqueCombinedFiles) {
    for (const file of uniqueCombinedFiles) {
      files
        .writeToFile({
          content: JSON.stringify(file.file, null, 2),
          folderPath: localUriParsed,
          name: file.name
        })
        .catch(function(err) {
          console.log(`Unable to save ${file.name} file`);
          console.error(err);
          process.exit(1);
        });
    }
  }
  counters.files = counters.files + uniqueCombinedFiles.length;
  return counters;
}
