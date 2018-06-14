"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
exports.default = {
    entityTypes: function (metadataXML) {
        const metadataJSON = this.parseXML(metadataXML.file);
        if (metadataJSON) {
            const entityTypes = metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0].EntityType;
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
    entityContainer: function (metadataXML) {
        const metadataJSON = this.parseXML(metadataXML.file);
        if (metadataJSON) {
            const aEntitySets = metadataJSON["edmx:Edmx"]["edmx:DataServices"][0].Schema[0]
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
    parseLocalUri: (localUri) => {
        return `webapp/${localUri
            .split("/")
            .splice(0, localUri.split("/").length - 1)
            .join("/")}`;
    },
    parseUri: (uri) => {
        return {
            path: uri
                .split("/")
                .splice(0, uri.split("/").length - 2)
                .join("/"),
            nameSpace: uri.split("/").splice(-2)[0]
        };
    },
    source: function (oSource) {
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
    parseXML: (xml) => {
        let oJson = null;
        xml2js_1.parseString(xml, function (err, result) {
            if (err) {
                console.log("Error parsing metadata: ", err);
            }
            else {
                oJson = result;
            }
        });
        return oJson;
    }
};
//# sourceMappingURL=parse.js.map