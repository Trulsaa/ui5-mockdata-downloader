"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = {
    reduceFilesToOne: (aFiles) => {
        const aFilesReduced = aFiles.reduce((acum, cur, i) => {
            acum.push(...cur.d.results);
            return acum;
        }, []);
        return { d: { results: aFilesReduced } };
    },
    parseLocalUri: (localUri) => {
        return `webapp/${localUri
            .split("/")
            .splice(0, localUri.split("/").length - 1)
            .join("/")}`;
    },
    createDirIfNonExistan: (dir) => {
        const dirs = dir
            .split("/")
            .reduce((accum, cur, i) => {
            const joined = accum[i] + cur + "/";
            accum.push(joined);
            return accum;
        }, [""])
            .splice(1);
        for (const dir of dirs) {
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdir(path_1.default.resolve(dir), error => {
                    if (error !== null)
                        console.error(error);
                });
            }
        }
    },
    writeToFile: function ({ content, folderPath, name, filetype = "json" }) {
        fs_1.default.writeFile(path_1.default.resolve(folderPath, `${name}.${filetype}`), content, "utf-8", function (err) {
            if (err) {
                return console.error(err);
            }
        });
    }
};
//# sourceMappingURL=files.js.map