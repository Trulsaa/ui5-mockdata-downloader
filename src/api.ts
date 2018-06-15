import download from "./download";

interface EntityType {
  name: string;
  entityType: string;
  nameSpace: string;
}

interface ParseSource {
  uri: string;
  path: string;
  nameSpace: string;
  type: string;
  settings: {
    odataVersion: string;
    localUri: string;
  };
}

export default {
  getMetadata: (parsedSource: ParseSource) => {
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
    entityTypes: EntityType[],
    parsedSource: ParseSource
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
    entityTypes: EntityType[],
    parsedSource: ParseSource
  ) {
    const entityParameters = this.createEntityDownloadParams(
      entityTypes,
      parsedSource
    );
    return download.downloadFiles(entityParameters);
  }
};
