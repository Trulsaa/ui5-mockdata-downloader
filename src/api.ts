import download from "./download";

interface EntityType {
  Name: string;
  path: string;
  NameSpace: string;
  params: string;
  json: boolean;
}

interface Source {
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
  getMetadata: (oSource: Source) => {
    // Download metadata
    const metadataParamseters = {
      name: "metadata",
      path: oSource.path,
      nameSpace: oSource.nameSpace,
      params: "$metadata",
      json: false
    };

    return download.downloadFile(metadataParamseters);
  },

  createEntityDownloadParams: function(
    aEntityTypes: EntityType[],
    oSource: Source
  ) {
    return aEntityTypes.map(set => {
      return {
        path: oSource.path,
        nameSpace: set.NameSpace,
        params: `${set.Name}/?$format=json&sap-client=200&sap-language=EN`,
        name: set.Name
      };
    });
  },

  getEntitySets: function(aEntityTypes: EntityType[], oSource: Source) {
    const entityParameters = this.createEntityDownloadParams(
      aEntityTypes,
      oSource
    );
    return download.downloadFiles(entityParameters);
  }
};
