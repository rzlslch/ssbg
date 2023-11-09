const path = require("path");
const { getDir } = require("../../global/variables");
const logger = require("./logger");
const { readdirSync } = require("fs");
const processFile = require("./processFile");
const globalVariables = require('../../global/variables');

module.exports = async (_dir) => {
  try {
    const mainDir = getDir();
    let fileProc = [];
    let method = `set${_dir}`.toString().trim();
    if (mainDir) {
      let targetDir = path.join(mainDir, _dir);
      let dataList = targetDir ? readdirSync(targetDir) : [];
      if (typeof globalVariables[method] === 'function') {
        fileProc = await processFile(_dir, dataList);
      }
    }
    if (typeof globalVariables[method] === "function") {
      globalVariables[method](fileProc);
    }
  } catch (error) {
    logger.error(error);
  }
}