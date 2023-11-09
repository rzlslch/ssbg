const { ENGINE_GENERATE } = require("../global/constants");
const { getMainWindow, setState, getState, resetState } = require("../global/variables");
const loadContent = require("./scripts/loadContent");
const logger = require("./scripts/logger");

module.exports = async (_, dir) => {
  try {
    // logger.info(`handleLoadSomething, ${dir}`);
    resetState();
    let content;
    content = loadContent(dir);
    setState({selectedButton:dir,content});
  } catch (error) {
    logger.error(error);
  }
  const state = getState();
  getMainWindow().webContents.send(ENGINE_GENERATE, state);
}