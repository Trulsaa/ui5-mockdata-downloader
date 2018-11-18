import {
  ParsedSource,
  ParsedEntityType,
  NavigationDownloadProperty,
  Params
} from "./interfaces";
import download from "./download";

export default {
  getMetadata: function(parsedSource: ParsedSource, params: Params) {
    // Download metadata
    const metadataParamseters = {
      name: "metadata",
      path: parsedSource.path,
      nameSpace: parsedSource.nameSpace,
      params: "$metadata",
      protocol: this._getProtocol(params),
      json: false,
      username: params.username,
      password: params.password,
      domainName: params.domainName
    };

    return download.file(metadataParamseters);
  },

  _getParams: function(params: Params) {
    const language = params.language ? params.language : "EN";
    const client = params.client ? params.client : "200";
    return `/?$format=json&sap-client=${client}&sap-language=${language}`;
  },

  _getProtocol: function(params: Params) {
    return params.protocol ? params.protocol : "https";
  },

  _createEntityDownloadParams: function(
    entityTypes: ParsedEntityType[],
    parsedSource: ParsedSource,
    params: Params
  ) {
    return entityTypes.map(set => {
      return {
        path: parsedSource.path,
        nameSpace: parsedSource.nameSpace,
        params: `${set.name}${this._getParams(params)}`,
        name: set.name,
        protocol: this._getProtocol(params),
        username: params.username,
        password: params.password,
        domainName: params.domainName
      };
    });
  },

  getEntitySets: function(
    entityTypes: ParsedEntityType[],
    parsedSource: ParsedSource,
    params: Params
  ) {
    const entityParameters = this._createEntityDownloadParams(
      entityTypes,
      parsedSource,
      params
    );
    return download.files(entityParameters);
  },

  _createNavParameters: function(
    navigationPropertys: NavigationDownloadProperty[],
    parsedSource: ParsedSource,
    params: Params
  ) {
    return navigationPropertys.map(nav => {
      return {
        url: nav.url.split("//")[1],
        params: `${this._getParams(params)}`,
        name: nav.set,
        protocol: this._getProtocol(params)
      };
    });
  },

  getNavigationSets: function(
    navigationPropertys: NavigationDownloadProperty[],
    parsedSource: ParsedSource,
    params: Params
  ) {
    const navParameters = this._createNavParameters(
      navigationPropertys,
      parsedSource,
      params
    );
    return download.files(navParameters);
  }
};
