# ui5-mockdata-downloader

Ui5-mockdata-downloader downloads all metadata.xml files from all OData services listed under the dataSources part of manifest.json. Each metadata.xml is parsed and used to download all entity type sets including all links to navigation properties as JSON. Duplicate entries in the JSON objects are removed. The JSON data and metadata.xml is then written to files in the directory specified by the localUri property in manifest.json.

Example dataSources part of manifest.json

```
"dataSources": {
	"ODATA_SERVICE": {
		"uri": "/sap/opu/odata/sap/ODATA_SERVICE/",
		"type": "OData",
		"settings": {
			"odataVersion": "2.0",
			"localUri": "localService/ODATA_SERVICE/metadata.xml"
		}
	}
},
```

## Install

First make sure you have installed the latest version of node.js (You may need to restart your computer after this step).

From NPM for use as a command line app:

```
npm install ui5-mockdata-downloader -g
```

From NPM for programmatic use:

```
npm install ui5-mockdata-downloader
```

## Command line usage

In you projects root dir create a file containing username, password and domainname formatted like this:

```
SAPPASSWORD=password123
SAPUSERNAME=USER123
SAPDOMAINNAME=domain.name.com
```

Run the following in your ui5 projects root.

```
ui5-mockdata-downloader
```

### Command line options

```
Usage: ui5-mockdata-downloader [options]

Options:

  -V, --version              output the version number
  -l, --language <language>  language code (default: EN)
  -c, --client <client>      client number (default: 200)
  -p, --protocol <protocol>  protocol: http or https (default: https)
  -d, --app-dir <dir>        app directory (default: webapp)
  -h, --help                 output usage information
```

## API Reference

Assuming installation via NPM, you can load ui5-mockdata-downloader in your application like this:

```
var download = require("ui5-mockdata-downloader");
```

This imports a function, `download(parameters)`, which takes an optional `parameters` object containing the optional parameters: `language`, `client`, `protocol` and `appDir`. Example:

```
download({
  language: "EN",    // default
  client: "200",     // default
  protocol: "https", // default
  appDir: "webapp"   // default
})
```
