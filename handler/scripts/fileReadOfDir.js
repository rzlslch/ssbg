const path = require("path");
const { readFileSync } = require("original-fs");
const { getDir } = require("../../global/variables");

module.exports = async (dir, filename) => {
  let mainDir = getDir();
  let filePath = path.join(mainDir, dir, filename);
  let fileRead = await readFileSync(filePath, { encoding: 'utf-8' });
  return fileRead;
}