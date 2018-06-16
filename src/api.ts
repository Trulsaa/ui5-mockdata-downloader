import{ ParsedSource, ParsedEntityType, NavigationDownloadProperty } from "./interfaces";
import download from "./download";

export default {
  getMetadata: (parsedSource: ParsedSource) => {
    // Download metadata
    const metadataParamseters = {
      name: "metadata",
      path: parsedSource.path,
      nameSpace: parsedSource.nameSpace,
      params: "$metadata",
      json: false
    };

    return download.file(metadataParamseters);
  },

  createEntityDownloadParams: function(
    entityTypes: ParsedEntityType[],
    parsedSource: ParsedSource
  ) {
    return entityTypes.map(set => {
      return {
        path: parsedSource.path,
        nameSpace: parsedSource.nameSpace,
        params: `${set.name}/?$format=json&sap-client=200&sap-language=EN`,
        name: set.name
      };
    });
  },

  getEntitySets: function(
    entityTypes: ParsedEntityType[],
    parsedSource: ParsedSource
  ) {
    const entityParameters = this.createEntityDownloadParams(
      entityTypes,
      parsedSource
    );
    return download.downloadFiles(entityParameters);
  },

  createNavParameters: function(
    navigationPropertys: NavigationDownloadProperty[],
    parsedSource: ParsedSource
  ) {
    return navigationPropertys.map(nav => {
      return {
        url: nav.url.split("//")[1],
        params: '/?$format=json&sap-client=200&sap-language=EN',
        name: nav.set
      }
    })
  },

  getNavigationSets: function(
    navigationPropertys: NavigationDownloadProperty[],
    parsedSource: ParsedSource
  ) {
    const navParameters = this.createNavParameters(
      navigationPropertys,
      parsedSource
    );
    return download.downloadFiles(navParameters)
  }
};
