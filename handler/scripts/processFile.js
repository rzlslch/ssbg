const path = require("path");
const { readFileSync } = require("original-fs")
const { getDir } = require("../../global/variables");
const logger = require("./logger");
const processConfig = require("./processConfig");

module.exports = async (_dir, list = []) => {
  try {
    const mainDir = getDir();
    let listConfig = [];
    for (const file of list) {
      const fileRead = readFileSync(path.join(mainDir, _dir, file), { encoding: 'utf-8' });
      let config = processConfig(fileRead);
      config.filename = file;
      listConfig.push(config);
    }
    return listConfig;
  } catch (error) {
    logger.error(error);
    return [];
  }
}