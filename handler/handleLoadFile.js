const path = require("path");
const { getDir, getMainWindow, setState, getState } = require("../global/variables");
const { readFileSync } = require("fs");
const { ENGINE_GENERATE } = require("../global/constants");
const logger = require("./scripts/logger");

module.exports = async (_, args) => {
  try {
    let dir = args.dir;
    let filename = args.filename;
    let mainDir = getDir();
    let pathFile = path.join(mainDir, dir, filename);
    const result = readFileSync(pathFile, { encoding: 'utf-8' });
    setState({selectedContent:filename,value:result,valuePath:pathFile});
  } catch (error) {
    logger.error(error);
  }
  const state = getState();
  getMainWindow().webContents.send(ENGINE_GENERATE, state);
}