const { ENGINE_GENERATE } = require("../global/constants");
const { getState, getMainWindow } = require("../global/variables")

module.exports = () => {
  const state = getState();
  getMainWindow().webContents.send(ENGINE_GENERATE, state);
}