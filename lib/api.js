const download = require("./download");

module.exports = {
  getMetadata: function(oSource) {
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

  createEntityDownloadParams: function(aEntityTypes, oSource) {
    return aEntityTypes.map(set => {
      return {
        path: oSource.path,
        nameSpace: set.NameSpace,
        params: `${set.Name}/?$format=json&sap-client=200&sap-language=EN`,
        name: set.Name
      };
    });
  },

  getEntitySets: function(aEntityTypes, oSource) {
    const entityParameters = this.createEntityDownloadParams(aEntityTypes, oSource);
    return download.downloadFiles({
      paramseters: entityParameters
    });
  }
};
