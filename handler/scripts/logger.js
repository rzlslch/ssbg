const { ENGINE_LOG } = require("../../global/constants")
const { getMainWindow } = require("../../global/variables")

module.exports = {
  info: (log) => getMainWindow().webContents.send(ENGINE_LOG, log),
  error: (log) => {
    console.log(log);
    getMainWindow().webContents.send(ENGINE_LOG, log)
  },
}