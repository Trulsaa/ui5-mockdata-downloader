"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_64_1 = __importDefault(require("base-64"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
exports.default = {
    startDownload: ({ path, nameSpace, params, username = process.env.SAPUSERNAME, password = process.env.SAPPASSWORD, protocol = "https://", domainName = process.env.SAPDOMAINNAME, json = true }) => {
        const url = `${protocol}${domainName}${path}/${nameSpace}/${params}`;
        const options = {
            method: "GET",
            url,
            headers: {
                Authorization: "Basic " + base_64_1.default.encode(username + ":" + password)
            },
            json
        };
        return request_promise_native_1.default(options);
    },
    downloadFile: async function (parameters) {
        const file = await this.startDownload(parameters);
        return {
            file: file,
            name: parameters.name,
            json: parameters.json
        };
    },
    downloadFiles: async function (paramseters) {
        const downloads = [];
        for (const fileParameters of paramseters) {
            const promiseOfFile = this.startDownload(Object.assign({}, fileParameters));
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
//# sourceMappingURL=download.js.map