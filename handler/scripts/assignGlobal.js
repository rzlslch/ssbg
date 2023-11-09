const path = require("path");
const { getDir } = require("../../global/variables");
const logger = require("./logger");
const { readdirSync } = require("fs");
const processFile = require("./processFile");
const globalVariables = require('../../global/variables');

module.exports = async (_dir) => {
  try {
    const mainDir = getDir();
    let targetDir = path.join(mainDir, _dir);
    let dataList = targetDir ? readdirSync(targetDir) : [];
    let method = `set${_dir}`.toString().trim();
    if (typeof globalVariables[method] === 'function') {
      const fileProc = await processFile(_dir, dataList);
      globalVariables[method](fileProc);
    }
  } catch (error) {
    logger.error(error);
  }
}