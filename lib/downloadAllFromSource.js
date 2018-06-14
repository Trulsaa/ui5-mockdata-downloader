"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const files_1 = __importDefault(require("./files"));
const parse_1 = __importDefault(require("./parse"));
const api_1 = __importDefault(require("./api"));
exports.default = {
    downloadAllFromSource: async function (oSource) {
        // Parse source
        const oSourceParsed = parse_1.default.source(oSource);
        // Download metadata.xml
        const metadataFile = await api_1.default.getMetadata(oSourceParsed);
        const aEntitySets = parse_1.default.entityContainer(metadataFile);
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
        const localUriParsed = files_1.default.parseLocalUri(oSourceParsed.settings.localUri);
        files_1.default.createDirIfNonExistan(localUriParsed);
        // // save metadata.xml
        // files.writeToFile({
        //   content: pd.xml(metadataFile),
        //   folderPath: localUriParsed,
        //   name: "metadata",
        //   filetype: "xml"
        // });
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
//# sourceMappingURL=downloadAllFromSource.js.map