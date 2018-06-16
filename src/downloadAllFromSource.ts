import { pd } from "pretty-data";

import files from "./files";
import download from "./download";
import parse from "./parse";
import api from "./api";

interface RawSource {
  uri: string;
  type: string;
  settings: {
    odataVersion: string;
    localUri: string;
  };
}

interface Map {
  parsedAssosiationSets: [
    {
      EntitySet: string;
      Role: string;
      association: string;
      name: string;
    }
  ];
  parsedAssosiations: [
    {
      Name: string;
      Role: string;
      Type: string;
    }
  ];
}

export default {
  downloadAllFromSource: async function(source: RawSource) {
    // Parse source
    const parsedSource = parse.source(source);

    // Download metadata.xml
    const metadataFile = await api.getMetadata(parsedSource);

    // parse metadata file into JSON
    const metadataJSON = parse.XML(metadataFile.file);

    let entitySets, navigationMap: any;
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
      entitySetFiles = await api.getEntitySets(entitySets, parsedSource);
    } else {
      console.log(`entitySets is ${entitySets}`);
    }

    // Get all Navigations and add type
    let navigations;
    if (entitySetFiles) {
      navigations = parse
        .navigations(entitySetFiles)
        .map((nav: { name: string; url: string }) => {
          return {
            name: nav.name,
            url: nav.url,
            set: parse.getSetFromNavMap(navigationMap, nav)
          };
        });
    }

    // Download all navigations
    const navigationFiles = await api.getNavigationSets(
      navigations,
      parsedSource
    );

    // Combine the sets
    let allFiles: any[], allSets, combinedFiles;
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
    }
    //
    // Write files
    //
    // Create dir to store all source files
    const localUriParsed = files.parseLocalUri(parsedSource.settings.localUri);
    files.createDirIfNonExistan(localUriParsed);

    // save metadata.xml
    files.writeToFile({
      content: pd.xml(metadataFile.file),
      folderPath: localUriParsed,
      name: "metadata",
      filetype: "xml"
    });

    // for (const file of Object.keys(allNavFiles)) {
    //   files.writeToFile({
    //     content: JSON.stringify(allNavFiles[file], null, 2),
    //     folderPath: localUriParsed,
    //     name: `${file}Set`
    //   });
    // }

    // aEntityTypes.forEach((entity, i: number) => {
    //   files.writeToFile({
    //     content: JSON.stringify(setFiles[i], null, 2),
    //     folderPath: localUriParsed,
    //     name: `${entity.Name}Set`
    //   });
    // });
  }
};
