import {DownloadParams} from "./interfaces"
import fs from "fs";
import base64 from "base-64";
import request from "request-promise-native";

export default {
  startDownload: ({
    path,
    nameSpace,
    params,
    url,
    username = process.env.SAPUSERNAME,
    password = process.env.SAPPASSWORD,
    protocol = "https://",
    domainName = process.env.SAPDOMAINNAME,
    json = true
  }: DownloadParams) => {
    url = url ? `${protocol}${url}${params}` : `${protocol}${domainName}${path}/${nameSpace}/${params}`;

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

  file: async function(parameters: DownloadParams) {
    const file = await this.startDownload(parameters).catch((err: any) => {
      console.log(`Error Downloading ${parameters.name}`);
      console.error(err);
      process.exit(1);
    });
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
