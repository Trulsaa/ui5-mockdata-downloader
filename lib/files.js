const fs = require("fs");
const path = require("path");

module.exports = {
  createDirIfNonExistan: dir => {
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
        fs.mkdirSync(path.resolve(dir), error => {
          if (error !== null) console.error(error);
        });
      }
    }
  },

  writeToFile: function({
    content = "test",
    path: writePath,
    name = "test",
    filetype = "json"
  }) {
    fs.writeFile(
      path.resolve(writePath, `${name}.${filetype}`),
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
