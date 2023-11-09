const path = require("path");
const { getSite, getDir } = require("../../global/variables");
const { readdirSync, statSync, unlinkSync, rmSync, cpSync } = require("fs");

module.exports = async () => {
  try {
    let buildDir = getSite().build_dir;
    let mainDir = getDir();
    let pathDir = path.join(mainDir, buildDir);
    let list = await readdirSync(pathDir);
    for (const file of list) {
      let filePath = path.join(pathDir, file);
      if (statSync(filePath).isFile()) unlinkSync(filePath);
      else rmSync(filePath, { recursive: true, force: true });
    }
    let srcDir = path.join(mainDir, "_assets");
    let destDir = path.join(mainDir, "public");
    cpSync(srcDir, destDir, { recursive: true });
  } catch (error) {
    
  }
}