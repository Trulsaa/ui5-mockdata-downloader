const fs = require("fs");
const base64 = require("base-64");
var request = require("request-promise-native");

module.exports = {
  startDownload: ({
    username = process.env.SAPUSERNAME,
    password = process.env.SAPPASSWORD,
    protocol = "https://",
    domainName = process.env.SAPDOMAINNAME,
    path = "",
    nameSpace = "",
    uri = "",
    params = "",
    json = true
  } = {}) => {
    const url = `${protocol}${domainName}${path}/${nameSpace}/${params}`;

    const options = {
      method: "GET",
      url,
      headers: {
        Authorization: "Basic " + base64.encode(username + ":" + password)
      },
      json
    };

    return request(options);
  },

  downloadFile: async function(parameters) {
    const file = await this.startDownload(parameters);
    return {
      file: file,
      name: parameters.name,
      json: parameters.json
    }
  },

  downloadFiles: async function({ paramseters = [] } = {}) {
    const downloads = [];
    for (const fileParameters of paramseters) {
      const promiseOfFile = this.startDownload({ ...fileParameters });
      downloads.push(promiseOfFile);
    }
    const results = await Promise.all(downloads);
    const taggedResults = results.map((file, i) => {
      return {
        file: file,
        name: paramseters[i].name,
        json: paramseters[i].json
      };
    });
    return taggedResults;
  }
};
