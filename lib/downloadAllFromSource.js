const prettyData = require("pretty-data").pd;

const files = require("./files");
const download = require("./download");
const parse = require("./parse");

const downloadAllFromSource = async oSource => {
  // Download metadata
  const metadataParamseters = [
    {
      uri: oSource.uri,
      params: "$metadata",
      json: false
    }
  ];

  const metadataFile = await download.downloadFiles({
    paramseters: metadataParamseters
  });

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

  // parse metadata.xml
  let aEntityTypes = parse.parseMetadata(metadataFile[0]);

  // Download EntitySets
  const entityParameters = aEntityTypes.map(set => {
    return {
      uri: oSource.uri,
      params: `${set.Name}Set/?$format=json&sap-client=200&sap-language=EN`
    };
  });

  // Download Sets
  const setFiles = await download.downloadFiles({
    paramseters: entityParameters
  });

  // Get key
  const selectedKey = aEntityTypes[0].Key;

  // Get values for keys
  const navKeys = setFiles[0].d.results.map(entry => entry[selectedKey]);

  // Create parameters to download navfiles
  const navParameters = {};
  aEntityTypes[0].Nav.forEach(nav => {
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
};

module.exports = downloadAllFromSource;
