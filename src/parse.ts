import { parseString } from "xml2js";

interface RawSource {
  uri: string;
  type: string;
  settings: {
    odataVersion: string;
    localUri: string;
  };
}

interface EntityType {
  $: {
    Name: string;
  };
  NavigationProperty: [NavProp];
  Key: [{ PropertyRef: [{ $: { Name: string } }] }];
}

interface FileProps {
  file: string;
  name: string;
}

interface EntitySet {
  $: {
    Name: string;
    EntityType: string;
  };
}

interface NavProp {
  $: {
    Name: string;
  };
}

interface ParsedXML {
  "edmx:Edmx": {
    "edmx:DataServices": [
      {
        Schema: [
          {
            EntityType: [EntityType];
            EntityContainer: [{ EntitySet: [EntitySet] }];
          }
        ];
      }
    ];
  };
}

export default {
  entityTypes: function(metadataXML: FileProps) {
    const metadataJSON = this.parseXML(metadataXML.file);
    if (metadataJSON) {
      const entityTypes =
        metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0].EntityType;
      return entityTypes.map(set => {
        return {
          Name: set.$.Name,
          NavigationProperty: set.NavigationProperty
            ? set.NavigationProperty.map(nav => nav.$.Name)
            : [],
          Key: set.Key ? set.Key[0].PropertyRef.map(key => key["$"].Name) : []
        };
      });
    }
  },

  entityContainer: function(metadataXML: {
    file: string;
    name: string;
    json?: boolean;
  }) {
    const metadataJSON = this.parseXML(metadataXML.file);
    if (metadataJSON) {
      const aEntitySets =
        metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0]
          .EntityContainer[0].EntitySet;
      return aEntitySets.map(set => {
        return {
          Name: set.$.Name,
          EntityType: set.$.EntityType.split(".")[1],
          NameSpace: set.$.EntityType.split(".")[0]
        };
      });
    }
  },

  parseLocalUri: (localUri: string) => {
    return `webapp/${localUri
      .split("/")
      .splice(0, localUri.split("/").length - 1)
      .join("/")}`;
  },

  parseUri: (uri: string) => {
    return {
      path: uri
        .split("/")
        .splice(0, uri.split("/").length - 2)
        .join("/"),
      nameSpace: uri.split("/").splice(-2)[0]
    };
  },

  source: function(oSource: RawSource) {
    return {
      uri: oSource.uri,
      path: this.parseUri(oSource.uri).path,
      nameSpace: this.parseUri(oSource.uri).nameSpace,
      type: oSource.type,
      settings: {
        odataVersion: oSource.settings.odataVersion,
        localUri: oSource.settings.localUri
      }
    };
  },
  // {
  //   "uri": "/sap/opu/odata/sap/ZZHR_SUBSTITUTIONS_SRV/",
  //   "type": "OData",
  //   "settings": {
  //     "odataVersion": "2.0",
  //     "localUri": "localService/ZZHR_SUBSTITUTIONS_SRV/metadata.xml"
  //   }
  // }

  parseXML: (xml: string): ParsedXML | null => {
    let oJson = null;
    parseString(xml, function(err, result) {
      if (err) {
        console.log("Error parsing metadata: ", err);
      } else {
        oJson = result;
      }
    });
    return oJson;
  }
};
