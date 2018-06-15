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

interface AssociationSet {
  $: {
    Association: string;
    Name: string;
  };
  End: [AssociationSetEnd];
}

interface NavProp {
  $: {
    Name: string;
  };
}

interface AssociationSetEnd {
  $: {
    EntitySet: string;
    Role: string;
  };
}

interface AssociationEnd {
  $: {
    Role: string;
    Type: string;
  };
}

interface ParsedXML {
  "edmx:Edmx": {
    "edmx:DataServices": [
      {
        Schema: [
          {
            EntityType: [EntityType];
            EntityContainer: [
              { EntitySet: [EntitySet]; AssociationSet: [AssociationSet] }
            ];
            Association: [{ $: { Name: string }; End: [AssociationEnd] }];
          }
        ];
      }
    ];
  };
}

export default {
  entityTypes: function(metadataJSON: ParsedXML) {
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

  entitySet: function(metadataJSON: ParsedXML) {
    const entitySets =
      metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0]
        .EntityContainer[0].EntitySet;
    return entitySets.map(set => {
      return {
        name: set.$.Name,
        entityType: set.$.EntityType.split(".")[1],
        nameSpace: set.$.EntityType.split(".")[0]
      };
    });
  },

  associationMap: function(metadataJSON: ParsedXML) {
    const associations =
      metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0].Association;
    const parsedAssosiations = associations.map(ass => {
      return {
        Name: ass.$.Name,
        Role: ass.End[1].$.Role,
        Type: ass.End[1].$.Type
      };
    });

    const associationSets =
      metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0]
        .EntityContainer[0].AssociationSet;
    const parsedAssosiationSets = associationSets.map(set => {
      return {
        association: set.$.Association,
        name: set.$.Name,
        EntitySet: set.End[1].$.EntitySet,
        Role: set.End[1].$.Role
      };
    });

    return {
      parsedAssosiations,
      parsedAssosiationSets
    };
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

  source: function(source: RawSource) {
    return {
      uri: source.uri,
      path: this.parseUri(source.uri).path,
      nameSpace: this.parseUri(source.uri).nameSpace,
      type: source.type,
      settings: {
        odataVersion: source.settings.odataVersion,
        localUri: source.settings.localUri
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

  XML: (xml: string): ParsedXML | null => {
    let oJson = null;
    parseString(xml, function(err, result) {
      if (err) {
        console.log("Error parsing metadata: ", err);
        process.exit(1);
      } else {
        oJson = result;
      }
    });
    return oJson;
  }
};
