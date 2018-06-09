const prettyData = require("pretty-data").pd;

const files = require("./files");
const download = require("./download");
const parse = require("./parse");
const api = require("./api");

module.exports = {
  downloadAllFromSource: async function(oSource) {
    const metadataFile = await api.getMetadata(oSource);

    // parse array of entity types
    let aEntityTypes = parse.parseEntityTypes(metadataFile[0]);

    // Download all EntitySets with navParameters
    const entityParameters = aEntityTypes.map(set => {
      return {
        uri: oSource.uri,
        params: `${set.Name}Set/?$format=json&sap-client=200&sap-language=EN`
      };
    });

    const setFiles = await download.downloadFiles({
      paramseters: entityParameters
    });

    // Get key
    const selectedKey = aEntityTypes[0].Key;

    // Get values for keys
    const navKeys = setFiles[0].d.results.map(entry => entry[selectedKey]);

    // Create parameters to download navfiles
    const navParameters = {};
    aEntityTypes[0].NavigationProperty.forEach(nav => {
      // nav parameters
      const curNavParameters = navKeys.map(key => {
        return {
          uri: oSource.uri,
          params: `/${
            aEntityTypes[0].Name
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

    //
    // Write files
    //
    // Create dir to store all source files
    const localUriParsed = files.parseLocalUri(oSource.settings.localUri);
    files.createDirIfNonExistan(localUriParsed);

    // save metadata.xml
    files.writeToFile({
      content: prettyData.xml(metadataFile[0]),
      path: localUriParsed,
      name: "metadata",
      filetype: "xml"
    });

    for (const file of Object.keys(allNavFiles)) {
      files.writeToFile({
        content: JSON.stringify(allNavFiles[file], null, 2),
        path: localUriParsed,
        name: `${file}Set`
      });
    }

    aEntityTypes.forEach((entity, i) => {
      files.writeToFile({
        content: JSON.stringify(setFiles[i], null, 2),
        path: localUriParsed,
        name: `${entity.Name}Set`
      });
    });
  }
};
