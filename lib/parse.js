const parseString = require("xml2js").parseString;

module.exports = {
  parseMetadata: metadata => {
    let aEntityTypes;

    parseString(metadata, function(err, result) {
      aEntityTypes = result["edmx:Edmx"][
        "edmx:DataServices"
      ][0].Schema[0].EntityType.map(set => {
        if (set.NavigationProperty) {
          return {
            Name: set["$"].Name,
            Nav: set.NavigationProperty
              ? set.NavigationProperty.map(nav => nav["$"].Name)
              : [],
            Key: set.Key ? set.Key[0].PropertyRef.map(key => key["$"].Name) : []
          };
        }
        return false;
      }).filter(set => set);
    });
    return aEntityTypes;
  }
};
