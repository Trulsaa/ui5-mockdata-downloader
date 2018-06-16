import { WriteFileParams } from "./interfaces";
import { promises as fsPromises } from "fs";
import fs from "fs";
import path from "path";

export default {
  reduceFilesToOne: (files: any) => {
    const filesReduced = files.reduce((acum: any, cur: any, i: any) => {
      acum.push(...cur.d.results);
      return acum;
    }, []);
    return { d: { results: filesReduced } };
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

  createDirIfNonExistant: async (dir: string) => {
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
        await fsPromises.mkdir(path.resolve(dir));
      }
    }
  },

  writeToFile: function({
    content,
    folderPath,
    name,
    filetype = "json"
  }: WriteFileParams) {
    fsPromises.writeFile(
      path.resolve(folderPath, `${name}.${filetype}`),
      content
    );
  }
};
