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
  downloadAllFromSource: async function(oSource: RawSource) {
    // Parse source
    const oSourceParsed = parse.source(oSource);

    // Download metadata.xml
    const metadataFile = await api.getMetadata(oSourceParsed);

    // const aEntitySets = parse.entityContainer(metadataFile);
    // parse entity type to get entity sets
    // const aEntitySets = parse.entityTypes(metadataFile[0]);

    // Download all EntitySets
    // const aEntitySetsFiles = await api.getEntitySets(
    //   aEntitySets,
    //   oSourceParsed
    // );

    /*
    // Get key
    const selectedKey = aEntitySets[0].Key;

    // Get values for keys
    const navKeys = setFiles[0].d.results.map(entry => entry[selectedKey]);

    // Create parameters to download navfiles
    const navParameters = {};
    aEntitySets[0].NavigationProperty.forEach(nav => {
      // nav parameters
      const curNavParameters = navKeys.map(key => {
        return {
          uri: oSourceParsed.uri,
          params: `/${
            aEntitySets[0].Name
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
    const localUriParsed = files.parseLocalUri(oSourceParsed.settings.localUri);
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
