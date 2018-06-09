const download = require("./download");

module.exports = {
  getMetadata: function(oSource) {
    // Download metadata
    const metadataParamseters = [
      {
        uri: oSource.uri,
        params: "$metadata",
        json: false
      }
    ];

    return download.downloadFiles({
      paramseters: metadataParamseters
    });
  }
};
