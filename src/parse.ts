import { parseString } from "xml2js";
import {
  ParsedXML,
  FileJson,
  NavigationMap,
  NavigationProperty,
  RawSource
} from "./interfaces";

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

  _getNavigations: function(result: any[]) {
    return result.reduce((accum, obj) => {
      const navigations = Object.keys(obj)
        .filter(key => obj[key].__deferred)
        .map(name => {
          return {
            name: name,
            url: obj[name].__deferred.uri
          };
        });
      if (navigations.length) {
        return accum.concat(navigations);
      }
      return;
    }, []);
  },

  navigations: function(entitySetFiles: FileJson[]) {
    return entitySetFiles
      .map(file => {
        return this._getNavigations(file.file.d.results);
      })
      .reduce((accum, file) => {
        if (file && file.length) {
          return accum.concat(file);
        }
        return accum;
      }, []);
  },

  setFromNavMap: function(map: NavigationMap, navigation: NavigationProperty) {
    const association = map.parsedAssosiations.find(ass =>
      ass.Type.includes(navigation.name)
    );
    if (association) {
      const associationSet = map.parsedAssosiationSets.find(
        set => set.Role === association.Role
      );
      if (associationSet) {
        return associationSet.EntitySet;
      }
    }
  },

  localUri: (localUri: string) => {
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
