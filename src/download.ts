import fs from "fs";
import base64 from "base-64";
import request from "request-promise-native";

interface DownloadParams {
  path: string;
  nameSpace: string;
  params: string;
  name: string;
  username?: string;
  password?: string;
  protocol?: string;
  domainName?: string;
  json?: boolean;
}

export default {
  startDownload: ({
    path,
    nameSpace,
    params,
    username = process.env.SAPUSERNAME,
    password = process.env.SAPPASSWORD,
    protocol = "https://",
    domainName = process.env.SAPDOMAINNAME,
    json = true
  }: DownloadParams) => {
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

  downloadFile: async function(parameters: DownloadParams) {
    const file = await this.startDownload(parameters);
    return {
      file: file,
      name: parameters.name,
      json: parameters.json
    };
  },

  downloadFiles: async function(paramseters: DownloadParams[]) {
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
