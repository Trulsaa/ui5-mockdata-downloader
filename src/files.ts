import { WriteFileParams } from "./interfaces";
import fs from "fs";
import path from "path";

export default {
  reduceFilesToOne: (aFiles: any) => {
    const aFilesReduced = aFiles.reduce((acum: any, cur: any, i: any) => {
      acum.push(...cur.d.results);
      return acum;
    }, []);
    return { d: { results: aFilesReduced } };
  },

  removeDuplicates: function(arr: any) {
    return arr.reduce((accum: any, current: any) => {
      const found = accum.some(
        (element: any) => current.__metadata.id === element.__metadata.id
      );
      if (!found) {
        accum.push(current);
      }
      return accum;
    }, []);
  },

  createDirIfNonExistan: (dir: string) => {
    const dirs = dir
      .split("/")
      .reduce(
        (accum, cur, i) => {
          const joined = accum[i] + cur + "/";
          accum.push(joined);
          return accum;
        },
        [""]
      )
      .splice(1);

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdir(path.resolve(dir), error => {
          if (error !== null) console.error(error);
        });
      }
    }
  },

  writeToFile: function({
    content,
    folderPath,
    name,
    filetype = "json"
  }: WriteFileParams) {
    fs.writeFile(
      path.resolve(folderPath, `${name}.${filetype}`),
      content,
      "utf-8",
      function(err) {
        if (err) {
          return console.error(err);
        }
      }
    );
  }
};
