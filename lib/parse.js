const parseString = require("xml2js").parseString;

module.exports = {
  parseEntityTypes: function(metadataXML) {
    const metadataJSON = this.parseXML(metadataXML);
    const oEntityTypes =
      metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0].EntityType;
    return oEntityTypes.map(set => {
      return {
        Name: set["$"].Name,
        NavigationProperty: set.NavigationProperty
          ? set.NavigationProperty.map(nav => nav["$"].Name)
          : [],
        Key: set.Key ? set.Key[0].PropertyRef.map(key => key["$"].Name) : []
      };
    });
  },

  parseXML: sXML => {
    let oJson;
    parseString(sXML, function(err, result) {
      if (err) {
        console.log("Error parsing metadata: ", err);
      } else {
        oJson = result;
      }
    });
    return oJson;
  }
};
