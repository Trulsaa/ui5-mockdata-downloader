const fs = require("fs");
const base64 = require("base-64");
var request = require("request-promise-native");

module.exports = {
  startDownload: ({
    username = process.env.SAPUSERNAME,
    password = process.env.SAPPASSWORD,
    protocol = "https://",
    domainName = process.env.SAPDOMAINNAME,
    uri = "",
    params = "",
    json = true
  } = {}) => {
    const url = `${protocol}${domainName}${uri}${params}`;

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

  downloadFiles: async function({
    paramseters = []
  } = {}) {
    const downloads = [];
    for (const fileParameters of paramseters) {
      const promiseOfFile = this.startDownload({ ...fileParameters });
      downloads.push(promiseOfFile);
    }
    const result = await Promise.all(downloads);
    return result
  },
};
