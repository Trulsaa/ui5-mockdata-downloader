"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const download_1 = __importDefault(require("./download"));
exports.default = {
    getMetadata: (oSource) => {
        // Download metadata
        const metadataParamseters = {
            name: "metadata",
            path: oSource.path,
            nameSpace: oSource.nameSpace,
            params: "$metadata",
            json: false
        };
        return download_1.default.downloadFile(metadataParamseters);
    },
    createEntityDownloadParams: function (aEntityTypes, oSource) {
        return aEntityTypes.map(set => {
            return {
                path: oSource.path,
                nameSpace: set.NameSpace,
                params: `${set.Name}/?$format=json&sap-client=200&sap-language=EN`,
                name: set.Name
            };
        });
    },
    getEntitySets: function (aEntityTypes, oSource) {
        const entityParameters = this.createEntityDownloadParams(aEntityTypes, oSource);
        return download_1.default.downloadFiles(entityParameters);
    }
};
//# sourceMappingURL=api.js.map