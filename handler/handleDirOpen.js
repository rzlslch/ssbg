const { dialog } = require("electron")
const { setDir, getDir } = require("../global/variables");
const generateSub = require("./scripts/generateSub");

module.exports = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (!canceled) setDir(filePaths[0]);
  if (canceled) setDir();
  await generateSub();
  return getDir();
}