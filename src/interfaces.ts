export interface Counters {
  downloads: number;
  files: number;
}

export interface WriteFileParams {
  content: string;
  folderPath: string;
  name: string;
  filetype?: string;
}

export interface ParsedEntityType {
  name: string;
  entityType: string;
  nameSpace: string;
}

export interface ParsedSource {
  uri: string;
  path: string;
  nameSpace: string;
  type: string;
  settings: {
    odataVersion: string;
    localUri: string;
  };
}

export interface NavigationDownloadProperty {
  name: string;
  url: string;
  set: string;
}

export interface NavigationProperty {
  name: string;
  url: string;
}

export interface RawSource {
  uri: string;
  type: string;
  settings: {
    odataVersion: string;
    localUri: string;
  };
}

export interface NavigationMap {
  parsedAssosiationSets: {
    EntitySet: string;
    Role: string;
    association: string;
    name: string;
  }[];
  parsedAssosiations: {
    Name: string;
    Role: string;
    Type: string;
  }[];
}

export interface RawSource {
  uri: string;
  type: string;
  settings: {
    odataVersion: string;
    localUri: string;
  };
}

export interface EntityType {
  $: {
    Name: string;
  };
  NavigationProperty: [NavProp];
  Key: [{ PropertyRef: [{ $: { Name: string } }] }];
}

export interface FileProps {
  file: string;
  name: string;
}

export interface FileJson {
  file: File;
  name: string;
}

export interface File {
  d: {
    results: ResultObject[];
  };
}

export interface ResultObject {
  __metadata: {
    id: string;
  };
  __deferred: {
    uri: string;
  };
}

export interface EntitySet {
  $: {
    Name: string;
    EntityType: string;
  };
}

export interface AssociationSet {
  $: {
    Association: string;
    Name: string;
  };
  End: [AssociationSetEnd];
}

export interface NavProp {
  $: {
    Name: string;
  };
}

export interface AssociationSetEnd {
  $: {
    EntitySet: string;
    Role: string;
  };
}

export interface AssociationEnd {
  $: {
    Role: string;
    Type: string;
  };
}

export interface ParsedXML {
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

export interface DownloadParams {
  name: string;
  params: string;
  path?: string;
  nameSpace?: string;
  url?: string;
  username?: string;
  password?: string;
  protocol?: string;
  domainName?: string;
  json?: boolean;
}
