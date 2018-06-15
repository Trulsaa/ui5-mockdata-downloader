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

export default {
  downloadAllFromSource: async function(source: RawSource) {
    // Parse source
    const parsedSource = parse.source(source);

    // Download metadata.xml
    const metadataFile = await api.getMetadata(parsedSource);

    // parse metadata file into JSON
    const metadataJSON = parse.XML(metadataFile.file);

    // Describe all sets
    let entitySets
    if (metadataJSON) {
      entitySets = parse.entityContainer(metadataJSON);
    } else {
      console.log(`metadataJSON is ${metadataJSON}`)
    }

    // Download all sets
    let entitySetFiles;
    if (entitySets) {
      entitySetFiles = await api.getEntitySets(entitySets, parsedSource);
    } else {
      console.log(`entitySets is ${entitySets}`)
    }

    // Get relationship between nav sets and sets
    // Finne alle Nav Set
    // Finne alle nav set per head set
    // kombinere set
    // Download all EntitySets

    /*
    // Get key
    const selectedKey = entitySets[0].Key;

    // Get values for keys
    const navKeys = setFiles[0].d.results.map(entry => entry[selectedKey]);

    // Create parameters to download navfiles
    const navParameters = {};
    entitySets[0].NavigationProperty.forEach(nav => {
      // nav parameters
      const curNavParameters = navKeys.map(key => {
        return {
          uri: parsedSource.uri,
          params: `/${
            entitySets[0].Name
          }Set('${key}')/${nav}/?$format=json&sap-client=200&sap-language=EN`
        };
      });
      navParameters[nav] = curNavParameters;
    });

    const allNavFiles = {};
    for (const nav of Object.keys(navParameters)) {
      curNavFiles = await download.downloadFiles({
        paramseters: navParameters[nav]
      });
      allNavFiles[nav] = files.reduceFilesToOne(curNavFiles);
    }
    */

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
